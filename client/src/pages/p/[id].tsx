import { initUrqlClient, withUrqlClient } from "next-urql";
import { useEffect, useState } from "react";
import CommentForm from "../../components/forms/CommentForm";
import { DotsIcon } from "../../components/Icons";
import NavBar from "../../components/NavBar";
import Comment from "../../components/post/Comment";
import PostInteractionBar from "../../components/post/PostInteractionBar";
import {
  PostDocument,
  PostQuery,
  useCurrentUserQuery,
  usePostQuery,
  usePostsByUserQuery,
} from "../../graphql/generated/graphql";
import { urqlClient } from "../../urqlClient";
import { timeSince } from "../../utis/timeSince";
import ErrorPage from "../404";
import dayjs from "dayjs";
import PostActions from "../../components/post/PostActions";
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from "urql";
import PostPreview from "../../components/post/PostPreview";

type Props = {
  serverPost: PostQuery["post"];
};

function Post({ serverPost }: Props) {
  if (!serverPost) {
    return <ErrorPage />;
  }

  // this query doesn't actually run, it's just how urql updates the client cache with the data from the server
  const [{ data }] = usePostQuery({
    variables: { id: serverPost.id },
  });

  const post = data?.post;
  // have to use the post data from the cache or we can't update it

  const [{ data: postsData, fetching: postsFetching }] = usePostsByUserQuery({
    variables: { username: serverPost.author.username, take: 7 },
  }); // using serverPost here as it is already defined

  const [{ data: userData }] = useCurrentUserQuery();

  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  const [open, setOpen] = useState(false);

  const [postTime, setPostTime] = useState("");

  useEffect(() => {
    setPostTime(dayjs(serverPost.createdAt).format("ll"));
  });
  // server wasn't matching client

  return !post ? null : (
    <>
      <NavBar />
      <PostActions
        open={open}
        setOpen={setOpen}
        post={post}
        user={userData?.currentUser}
      />
      <div className="flex w-full items-center justify-center pt-12">
        <div className="flex h-full bg-white md:bg-background flex-col items-center w-full md:w-[935px]">
          <article className="md:h-[600px] w-full border-t-[1px] md:border-[1px] flex flex-col md:flex-row text-m border-gray-300 bg-white">
            <img src={post.imageUrl} className="w-full md:w-[600px]" />
            <div className="w-full flex flex-col justify-between">
              <header className="h-[60px] w-full hidden md:flex items-center justify-between p-4 border-b-[1px] border-gray-300">
                <div className="flex items-center">
                  <img
                    src={
                      post.author.avatarUrl
                        ? post.author.avatarUrl
                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    }
                    className="h-8 rounded-full"
                  />
                  <h3 className="ml-3 font-semibold">{post.author.username}</h3>
                </div>
                <button onClick={() => setOpen(true)}>
                  <DotsIcon className={"h-6 stroke-1.5"} />
                </button>
              </header>
              <section className="hidden h-full md:flex flex-col items-start justify-start p-4 leading-5 overflow-auto no-scrollbar">
                {post.caption && (
                  <span className="flex mb-2">
                    <img
                      src={
                        post.author.avatarUrl
                          ? post.author.avatarUrl
                          : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                      }
                      className="h-8 rounded-full mr-4"
                    />
                    <span>
                      <h3 className="font-semibold float-left mr-1">
                        {post.author.username}
                      </h3>
                      <p>{post.caption}</p>
                    </span>
                  </span>
                )}
                {/* don't wait for fetching on this because it updates when the user is fetched anyway */}
                {post.comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    user={userData?.currentUser}
                  />
                ))}
              </section>
              <footer className="border-t-[1px] border-gray-300 flex flex-col">
                <PostInteractionBar
                  post={post}
                  className="w-full flex px-1 pt-1 justify-between"
                />
                <div className="flex h-7 px-4">
                  {post.likeCount > 0 ? (
                    <p className="font-semibold">
                      {post.likeCount} {`like${post.likeCount > 1 ? "s" : ""}`}
                    </p>
                  ) : (
                    <span className="flex">
                      Be the first to
                      <p className="ml-1 font-semibold"> like this</p>
                    </span>
                  )}
                </div>
                <time
                  dateTime={post.createdAt}
                  title={postTime}
                  className="text-gray-500 text-xxs flex items-center px-4 mb-4"
                >
                  {timeSince(post.createdAt).toUpperCase()}
                </time>
                <section className="border-t-[1px] border-gray-300 hidden md:flex">
                  <CommentForm post={post} iconStyles={styles.icon} />
                </section>
              </footer>
            </div>
          </article>
          <div className="border-t-[1px] border-gray-300 mt-12 py-16 w-full">
            {postsData?.posts && postsData.posts.posts.length > 1 && (
              <>
                <h5 className="text-sm text-gray-600 mb-4">
                  More posts from{" "}
                  <span className="font-semibold">{post.author.username}</span>
                </h5>
                <div className="grid grid-cols-3 gap-1 md:gap-7">
                  {postsData?.posts.posts
                    .map((userPost) => {
                      if (userPost.id !== post.id) {
                        // don't show a duplicate of the current post
                        return (
                          <PostPreview key={userPost.id} post={userPost} />
                        );
                      }
                    })
                    .slice(0, 6)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, params }: any) {
  // fetching the post on the server side
  // the posts by user query needs a post id

  // if the url params don't match the post id format, just return instantly
  if (!params.id.match(/^[a-zA-Z0-9]+$/)) {
    return {
      props: {
        serverPost: null,
      },
    };
  }

  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: "http://localhost:4000/graphql",
      fetchOptions: {
        credentials: "include",
        headers: {
          cookie: req.headers.cookie,
        },
      },
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    },
    false
  );

  const res = await client?.query(PostDocument, { id: params.id }).toPromise();

  // if there is no post, the if statement catches it and returns an error page

  return {
    props: {
      urqlState: ssrCache.extractData(),
      serverPost: res?.data.post,
    },
  };
}

export default withUrqlClient(urqlClient, {
  ssr: false,
})(Post);
