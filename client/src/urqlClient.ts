import { dedupExchange, gql, errorExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import {
  GraphCacheConfig,
  CurrentUserDocument,
  Comment,
} from "./graphql/generated/graphql";
import { isServer } from "./utis/isServer";
import Router from "next/router";

// creating the urql client and configuring the caching settings
// in "updates" it describes what to do when each query happens

export const urqlClient = (ssrExchange: any, ctx: any) => {
  let cookie; // telling the Next.js server to include the cookie sent from the client in the header
  if (isServer() && ctx) {
    cookie = ctx.req.headers.cookie;
  }
  // without this, the cookie won't get sent for pages with SSR
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include",
      headers: cookie ? { cookie } : undefined,
    } as const,
    exchanges: [
      errorExchange({
        onError(error) {
          // listens to an error globally
          if (error.message.includes("Not authenticated")) {
            Router.push({
              pathname: "/login",
              query: { from: Router.asPath },
              // use asPath as it is the literal url string
            });
          }
        },
      }),
      dedupExchange, // prevents duplication of queries
      cacheExchange<GraphCacheConfig>({
        keys: {
          PostsResponse: () => null,
          User: () => null,
          Like: () => null,
        }, // urql needs a key for each response, and returning null forces it to look at posts for one
        updates: {
          Mutation: {
            login: (result, _args, cache, _info) => {
              cache.updateQuery({ query: CurrentUserDocument }, (data) => {
                if (result.login.errors) {
                  // if bad login, just return the currently cached currentUser
                  return data;
                } else {
                  // set the currentUser to the logged in user
                  return {
                    __typename: "User",
                    currentUser: {
                      ...result.login.user,
                    },
                  };
                }
              });
              // refetches posts
              cache.invalidate("Query", "posts", {
                take: 10,
              });

              // invalidate all the post queries (to update the like icons)
              cache
                .inspectFields("Query")
                .filter((field) => field.fieldName === "post")
                .forEach((field) => {
                  cache.invalidate("Query", field.fieldName, field.arguments);
                });
            },
            register: (result, _args, cache, _info) => {
              cache.updateQuery({ query: CurrentUserDocument }, (data) => {
                if (result.register.errors) {
                  return data;
                } else {
                  return {
                    __typename: "User",
                    currentUser: {
                      ...result.register.user,
                    },
                  };
                }
              });
            },
            logout: (result, _args, cache, _info) => {
              // when log out request sent, clear the currentUser
              cache.updateQuery({ query: CurrentUserDocument }, (data) => {
                if (result.logout) {
                  return { __typename: "User", currentUser: null };
                }
                return data;
              });
              cache.invalidate("Query", "posts", {
                take: 10,
              });

              cache
                .inspectFields("Query")
                .filter((field) => field.fieldName === "post")
                .forEach((field) => {
                  cache.invalidate("Query", field.fieldName, field.arguments);
                });
            },
            createPost: (result, args, cache, _info) => {
              cache.invalidate("Query", "posts", {
                take: 10,
              });
            },
            createComment: (result, args, cache, _info) => {
              if (result.createComment.comment) {
                const { postId } = args;
                const feedPost = cache.readFragment(
                  gql`
                    fragment _ on Post {
                      id
                      commentsPreview {
                        id
                        text
                        author {
                          username
                        }
                      }
                    }
                  `,
                  { id: postId }
                );

                if (feedPost) {
                  const { commentsPreview } = feedPost;
                  // if this was on the feed, update the comments preview

                  // necessary or urql gets upset
                  const commentsWithTypename = commentsPreview.map(
                    (comment: Comment) => {
                      return {
                        __typename: "Comment",
                        ...comment,
                      };
                    }
                  );

                  // add the newly created comment to the preview
                  commentsWithTypename.unshift({
                    __typename: "Comment",
                    ...result.createComment.comment,
                  });

                  cache.writeFragment(
                    gql`
                      fragment __ on Post {
                        id
                        commentsPreview {
                          id
                          text
                          author {
                            username
                          }
                        }
                      }
                    `,
                    {
                      id: postId,
                      commentsPreview: commentsWithTypename,
                    }
                  );
                }

                const post = cache.readFragment(
                  gql`
                    fragment _ on Post {
                      id
                      comments {
                        id
                        text
                        author {
                          username
                        }
                      }
                    }
                  `,
                  { id: postId }
                );

                if (post) {
                  const { comments } = post;
                  // if this was on the post page
                  const commentsWithTypename = comments.map(
                    (comment: Comment) => {
                      return {
                        __typename: "Comment",
                        ...comment,
                      };
                    }
                  );

                  commentsWithTypename.unshift({
                    __typename: "Comment",
                    ...result.createComment.comment,
                  });

                  cache.writeFragment(
                    gql`
                      fragment __ on Post {
                        id
                        comments {
                          id
                          text
                          author {
                            username
                          }
                        }
                      }
                    `,
                    {
                      id: postId,
                      comments: commentsWithTypename,
                    }
                  );
                }
              }
            },
            like: (result, args, cache, _info) => {
              if (result.like) {
                // if like was successful
                const { entityId } = args;

                // checking if it was a post that was liked
                const post = cache.readFragment(
                  gql`
                    fragment _ on Post {
                      id
                      liked
                      likeCount
                    }
                  `,
                  { id: entityId }
                );

                if (post) {
                  // find the post in the cache update it
                  cache.writeFragment(
                    gql`
                      fragment __ on Post {
                        id
                        liked
                        likeCount
                      }
                    `,
                    { id: entityId, liked: true, likeCount: post.likeCount + 1 }
                  );
                }

                // the same for a comment
                const comment = cache.readFragment(
                  gql`
                    fragment _ on Comment {
                      id
                      liked
                      likeCount
                    }
                  `,
                  { id: entityId }
                );

                if (comment) {
                  cache.writeFragment(
                    gql`
                      fragment __ on Comment {
                        id
                        liked
                        likeCount
                      }
                    `,
                    {
                      id: entityId,
                      liked: true,
                      likeCount: comment.likeCount + 1,
                    }
                  );
                }
              }
            },
            removeLike: (result, args, cache, _info) => {
              // same logic as like
              if (result.removeLike) {
                const { entityId } = args;

                const post = cache.readFragment(
                  gql`
                    fragment _ on Post {
                      id
                      liked
                      likeCount
                    }
                  `,
                  { id: entityId }
                );

                if (post) {
                  cache.writeFragment(
                    gql`
                      fragment __ on Post {
                        id
                        liked
                        likeCount
                      }
                    `,
                    {
                      id: entityId,
                      liked: false,
                      likeCount: post.likeCount - 1,
                    }
                  );
                }

                const comment = cache.readFragment(
                  gql`
                    fragment _ on Comment {
                      id
                      liked
                      likeCount
                    }
                  `,
                  { id: entityId }
                );

                if (comment) {
                  cache.writeFragment(
                    gql`
                      fragment __ on Comment {
                        id
                        liked
                        likeCount
                      }
                    `,
                    {
                      id: entityId,
                      liked: false,
                      likeCount: comment.likeCount - 1,
                    }
                  );
                }
              }
            },
            savePost: (result, args, cache, _info) => {
              // same logic as likes, but you can only save posts so we don't check for a post/comment here
              if (result.savePost) {
                // if like was successful
                const { id } = args;

                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      id
                      saved
                    }
                  `,
                  { id: id, saved: true }
                );
              }
            },
            removeSavedPost: (result, args, cache, _info) => {
              if (result.removeSavedPost) {
                // if like was successful
                const { id } = args;

                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      id
                      saved
                    }
                  `,
                  { id: id, saved: false }
                );
              }
            },
            deletePost: (result, args, cache, _info) => {
              if (result.deletePost.post) {
                cache.invalidate("Query", "posts", {
                  take: 10,
                });
              }
            },
            deleteComment: (result, args, cache, _info) => {
              if (result.deleteComment.comment) {
                cache.invalidate("Query", "post", {
                  id: result.deleteComment.comment.postId,
                });
              }

              if (result.deleteComment.comment) {
                cache.invalidate("Query", "posts", {
                  take: 10,
                });
              }
            },
          },
        },
      }),
      ssrExchange,
      multipartFetchExchange,
    ],
  };
};
