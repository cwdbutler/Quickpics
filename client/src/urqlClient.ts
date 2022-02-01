import { dedupExchange, gql } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import {
  GraphCacheConfig,
  CurrentUserDocument,
} from "./graphql/generated/graphql";
import { isServer } from "./utis/isServer";

export const urqlClient = (ssrExchange: any, ctx: any) => {
  let cookie; // telling the Next.js server to include the cookie sent from the client in the header
  if (isServer()) {
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
      dedupExchange, // prevents duplication of queries
      cacheExchange<GraphCacheConfig>({
        keys: {
          PostsResponse: () => null,
          User: () => null,
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
              // refetches allPosts
              cache.invalidate("Query", "allPosts", {
                take: 10,
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
              cache.invalidate("Query", "allPosts", {
                take: 10,
              });
            },
            createPost: (result, _args, cache, _info) => {
              cache.invalidate("Query", "allPosts", {
                take: 10,
              });
            },
            like: (result, args, cache, _info) => {
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

              if (result.like) {
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
            },
            removeLike: (result, args, cache, _info) => {
              const { entityId } = args;
              const post = cache.readFragment(
                gql`
                  fragment _dsdsdsds on Post {
                    id
                    liked
                    likeCount
                  }
                `,
                { id: entityId }
              );
              if (result.removeLike) {
                cache.writeFragment(
                  gql`
                    fragment _dsdsdssd__ on Post {
                      id
                      liked
                      likeCount
                    }
                  `,
                  { id: entityId, liked: false, likeCount: post.likeCount - 1 }
                );
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
