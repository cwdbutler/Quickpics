import { initUrqlClient, withUrqlClient } from "next-urql";
import { urqlClient } from "../urqlClient";
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from "urql";
import {
  PostsByUserDocument,
  PostsByUserQuery,
  usePostsByUserQuery,
  UserDocument,
  UserQuery,
  useUserQuery,
} from "../graphql/generated/graphql";
import PostPreview from "../components/post/PostPreview";
import ErrorPage from "./404";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import Head from "next/head";

type Props = {
  user: UserQuery["user"];
  posts: PostsByUserQuery;
};

function UserProfile({ posts, user }: Props) {
  if (!user) {
    return <ErrorPage />;
  }

  const router = useRouter();

  const [{ data: userData }] = useUserQuery({
    variables: {
      username: user.username,
    },
  });

  const [{ data: postsData }] = usePostsByUserQuery({
    variables: {
      take: 6,
      username: user.username,
    },
  });

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center py-2">
        <Head>
          <title>{userData?.user?.username}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="my-12 flex flex-col items-center w-full flex-1">
          <div className="w-[935px] flex flex-col">
            <header className="flex">
              <img
                src={
                  user.avatarUrl
                    ? user.avatarUrl
                    : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                }
                draggable={false}
                className="h-[150px] rounded-full mx-20"
              />
              <section aria-label="User information" className="flex-grow">
                <h2 className="text-3xl pt-1 font-light">{user.username}</h2>
                <div>{user.postCount} posts</div>
              </section>
            </header>
            <section className="w-full mt-24 border-gray-300 border-t-[1px]">
              <div className="w-full flex items-center justify-center">
                posts / saved
              </div>
              <div className="grid grid-cols-3 gap-6">
                {postsData?.posts.posts && postsData.posts.posts.length > 0 ? (
                  postsData?.posts.posts.map((post) => (
                    <PostPreview key={post.id} post={post} />
                  ))
                ) : (
                  <div>no posts</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, params }: any) {
  // fetching the user and their posts on the server side
  // the posts by user query needs a username from the params

  // if the url params don't match the username format, just return instantly
  if (!params.username.match(/^[a-zA-Z0-9]+$/)) {
    return {
      props: {
        user: null,
        posts: null,
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
          // don't really need the cookie here but just in case
        },
      },
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    },
    false
  );

  const userRes = await client
    ?.query(UserDocument, { username: params.username })
    .toPromise();

  let postsRes;
  if (!userRes?.data.user) {
    // if that user doesn't exist, don't try and fetch their posts
    return {
      props: {
        user: null,
        posts: null,
      },
    };
  } else {
    postsRes = await client
      ?.query(PostsByUserDocument, { take: 6, username: params.username })
      .toPromise();
  }

  return {
    props: {
      urqlState: ssrCache.extractData(),
      posts: postsRes?.data.posts.posts,
      user: userRes?.data.user,
    },
  };
}

export default withUrqlClient(urqlClient, {
  ssr: false,
})(UserProfile);
