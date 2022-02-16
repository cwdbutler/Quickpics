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
  PostsByUserDocument,
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
import Link from "next/link";
import Image from "next/image";
import LikesModal from "../../components/post/LikesModal";
import Head from "next/head";
import { API_URL, BLUR_PIXEL } from "../../utis/constants";

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
  // again, this query doesn't run as urql realises the date is already cached

  const [{ data: userData }] = useCurrentUserQuery();

  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  const [open, setOpen] = useState(false);

  const [likesOpen, setLikesOpen] = useState(false);

  const [focusForm, setFocusForm] = useState(0);

  return !post ? null : (
    <>
      <NavBar />
      <Head>
        <title>
          {post.author.username} on Quickpics
          {post.caption && `: "${post.caption}"`}
        </title>
      </Head>
      <PostActions
        open={open}
        setOpen={setOpen}
        post={post}
        user={userData?.currentUser}
      />
      <div className="flex w-full items-center justify-center pt-12">
        <div className="flex h-full bg-white md:bg-background flex-col items-center w-full md:w-[735px] lg:w-[935px]">
          <article className="md:h-[400px] lg:h-[600px] w-full border-t-[1px] md:border-[1px] flex flex-col md:flex-row text-m border-gray-300 bg-white">
            <div className="w-full md:w-[400px] lg:w-[600px]">
              <Image
                src={post.imageUrl}
                width={600}
                height={600}
                priority={true}
                placeholder="blur"
                blurDataURL={BLUR_PIXEL}
              />
            </div>
            <div className="w-full md:w-[335px] flex flex-col justify-between">
              <header className="h-[60px] w-full hidden md:flex items-center justify-between p-4 border-b-[1px] border-gray-300">
                <div className="flex items-center space-x-3">
                  <Link href={`/${post.author.username}`}>
                    <a className="flex">
                      <Image
                        objectFit="cover"
                        width={32}
                        height={32}
                        src={
                          post.author.avatarUrl
                            ? post.author.avatarUrl
                            : "/default.jpg"
                        }
                        className="rounded-full"
                      />
                    </a>
                  </Link>
                  <Link href={`/${post.author.username}`}>
                    <a>
                      <h3 className="font-semibold">{post.author.username}</h3>
                    </a>
                  </Link>
                </div>
                <button onClick={() => setOpen(true)}>
                  <DotsIcon className={"h-6 stroke-1.5"} />
                </button>
              </header>
              <section className="hidden w-full h-full md:flex flex-col items-start justify-start p-4 leading-text overflow-auto no-scrollbar">
                {post.caption && (
                  <div className="w-full flex mb-2">
                    <span className="flex flex-shrink-0">
                      <Link href={`/${post.author.username}`}>
                        <a className="mr-3">
                          <Image
                            objectFit="cover"
                            width={32}
                            height={32}
                            src={
                              post.author.avatarUrl
                                ? post.author.avatarUrl
                                : "/default.jpg"
                            }
                            className="rounded-full"
                          />
                        </a>
                      </Link>
                    </span>
                    <span className="w-full">
                      <Link href={`/${post.author.username}`}>
                        <a>
                          <h3 className="font-semibold float-left mr-1">
                            {post.author.username}
                          </h3>
                        </a>
                      </Link>
                      <p aria-label="Post caption">{post.caption}</p>
                    </span>
                  </div>
                )}
                <ul>
                  {/* don't wait for fetching on this because it updates when the user is fetched anyway */}
                  {post.comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      user={userData?.currentUser}
                    />
                  ))}
                </ul>
              </section>
              <footer className="border-t-[1px] border-gray-300 flex flex-col">
                <PostInteractionBar
                  post={post}
                  className="w-full flex px-1 pt-1 justify-between"
                  focusForm={focusForm}
                  setFocusForm={setFocusForm}
                />
                <div className="flex h-7 px-4">
                  {post.likeCount > 0 ? (
                    <>
                      <LikesModal
                        entityId={post.id}
                        likesOpen={likesOpen}
                        setLikesOpen={setLikesOpen}
                        type="post"
                      />
                      <button type="button" onClick={() => setLikesOpen(true)}>
                        <h3 className="font-semibold">
                          {post.likeCount}{" "}
                          {`like${post.likeCount > 1 ? "s" : ""}`}
                        </h3>
                      </button>
                    </>
                  ) : (
                    <span className="flex">
                      Be the first to
                      <p className="ml-1 font-semibold"> like this</p>
                    </span>
                  )}
                </div>
                <time
                  dateTime={post.createdAt}
                  title={dayjs(serverPost.createdAt).format("ll")}
                  className="text-gray-500 text-xxs flex items-center px-4 mb-4"
                >
                  {timeSince(post.createdAt).toUpperCase()}
                </time>
                <section className="border-t-[1px] border-gray-300 flex">
                  <CommentForm
                    currentUser={userData?.currentUser}
                    post={post}
                    iconStyles={styles.icon}
                    focusForm={focusForm}
                  />
                </section>
              </footer>
            </div>
          </article>
          <div className="border-t-[1px] border-gray-300 mt-12 py-16 w-full">
            {postsData?.posts && postsData.posts.posts.length > 1 && (
              <>
                <h5 className="text-sm text-gray-600 mb-4">
                  More posts from{" "}
                  <Link href={`/${post.author.username}`}>
                    <a className="font-semibold">{post.author.username}</a>
                  </Link>
                </h5>
                <div className="grid grid-cols-3 gap-1 md:gap-7">
                  {postsData?.posts.posts
                    .filter((userPost) => userPost.id !== post.id)
                    .map((userPost) => (
                      <PostPreview key={userPost.id} post={userPost} />
                    ))
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
      url: API_URL,
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

  const postRes = await client
    ?.query(PostDocument, { id: params.id })
    .toPromise();

  if (!postRes?.data.post) {
    return {
      props: {
        serverPost: null,
      },
    };
  } else {
    await client
      ?.query(PostsByUserDocument, {
        take: 7,
        username: postRes?.data.post.author.username,
      })
      .toPromise();
  }

  return {
    props: {
      urqlState: ssrCache.extractData(), // passes the data to the urql client in the browser
      serverPost: postRes?.data.post,
    },
  };
}

export default withUrqlClient(urqlClient, {
  ssr: false,
})(Post);
