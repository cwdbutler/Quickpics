import { initUrqlClient, withUrqlClient } from "next-urql";
import { urqlClient } from "../../urqlClient";
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from "urql";
import {
  PostsByUserDocument,
  PostsByUserQueryVariables,
  useCurrentUserQuery,
  usePostsByUserQuery,
  UserDocument,
  UserQuery,
  useUserQuery,
} from "../../graphql/generated/graphql";
import PostPreview from "../../components/post/PostPreview";
import ErrorPage from "../404";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import Head from "next/head";
import { Tab } from "@headlessui/react";
import { Fragment, useState } from "react";
import { BookmarkIcon, GridIcon, SimplePlusIcon } from "../../components/Icons";
import Link from "next/link";
import { Waypoint } from "react-waypoint";
import Image from "next/image";
import ProfilePicForm from "../../components/forms/ProfilePicForm";
import Spinner from "../../components/Spinner";
import { API_URL } from "../../utis/constants";

interface PageProps {
  variables: PostsByUserQueryVariables;
  isLastPage: boolean;
  loadMore: (cursor: string) => void;
}

function Page({ variables, isLastPage, loadMore }: PageProps) {
  const [{ data, fetching }] = usePostsByUserQuery({
    variables,
  });

  const posts = data?.posts.posts;
  const hasMore = data?.posts.hasMore;

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-6 mt-1 md:mt-6">
      {posts?.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
      {isLastPage && hasMore && (
        // when this becomes visible on the screen, it loads more posts
        <Waypoint
          onEnter={() => {
            if (posts) {
              loadMore(data.posts.posts[data.posts.posts.length - 1].id);
            }
          }}
        />
      )}
      {fetching && (
        <div className="col-span-3 flex items-center justify-center my-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}

type Props = {
  serverUser: UserQuery["user"];
  serverPosts: any;
};

interface PageVariables {
  take: number;
  cursor?: string;
  username: string;
}
const take = 12;

function UserProfile({ serverUser, serverPosts }: Props) {
  if (!serverUser) {
    return <ErrorPage />;
  }
  const username = serverUser.username;

  const router = useRouter();

  const [{ data }] = useUserQuery({
    variables: {
      username: serverUser.username,
    },
  });

  const [{ data: currentUserData }] = useCurrentUserQuery();

  const isMyProfile =
    currentUserData?.currentUser?.username === serverUser.username;

  const [pageVariables, setPageVariables] = useState<PageVariables[]>([
    {
      take: take,
      username: serverUser.username,
    },
  ]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center py-2">
        <Head>
          <title>{serverUser.username} • Quickpics</title>
        </Head>

        <div className="my-6 flex flex-col items-center w-full flex-1">
          <div className="w-full min-h-screen lg:w-[935px] flex flex-col">
            <header className="flex">
              <div className="mx-5 w-20 sm:w-40 sm:mx-20 select-none flex flex-col items-center relative flex-shrink-0">
                {isMyProfile ? (
                  // i'm not sure which specific query makes the cache update but it works at the moment
                  // i pass it the user query here as i think it updates everywhere it sees that User object
                  <ProfilePicForm user={data?.user} />
                ) : (
                  <Image
                    objectFit="cover"
                    aria-label="Profile picture upload"
                    width={150}
                    height={150}
                    priority
                    src={
                      serverUser.avatarUrl
                        ? serverUser.avatarUrl
                        : "/default.jpg"
                    }
                    className="rounded-full"
                  />
                )}
              </div>
              <section aria-label="User information" className="flex-grow">
                <div className="flex flex-col space-y-5">
                  <h2 className="text-3xl pt-1 font-light break-all sm:break-normal">
                    {serverUser.username}
                  </h2>
                  <span>
                    <span className="font-semibold mr-1">
                      {serverUser.postCount}
                    </span>
                    {`post${serverUser.postCount === 1 ? "" : "s"}`}
                  </span>
                </div>
              </section>
            </header>
            <section className="w-full mt-10 border-gray-300 border-t-[1px]">
              <Tab.Group
                manual
                defaultIndex={0}
                onChange={(_index) => {
                  router.push(`/${serverUser.username}/saved`);
                }}
              >
                {currentUserData && (
                  <Tab.List className="flex text-xs items-center justify-center w-full">
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={`${
                            selected
                              ? "font-semibold border-t-[1px] border-gray-500"
                              : "text-gray-300 font-semibold"
                          } p-4 -m-[1px] tracking-wider flex items-center justify-center`}
                        >
                          <GridIcon className="mr-1 h-4 stroke-1.5" />
                          POSTS
                        </button>
                      )}
                    </Tab>
                    {isMyProfile && (
                      // if this is their profile, show the SAVED tab
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={`${
                              selected
                                ? "font-semibold border-t-[1px] border-gray-500"
                                : "text-gray-300 font-semibold"
                            } p-4 -m-[1px] tracking-wider flex items-center justify-center`}
                          >
                            <BookmarkIcon className="mr-1 h-4 stroke-1.5" />
                            SAVED
                          </button>
                        )}
                      </Tab>
                    )}
                  </Tab.List>
                )}
                <Tab.Panels>
                  <Tab.Panel className="-mt-1 md:-mt-6">
                    {serverPosts && serverPosts.length > 0 ? (
                      pageVariables.map((variables, index) => {
                        return (
                          <Page
                            key={"key" + variables.cursor} // cursor is null for first page
                            variables={variables}
                            isLastPage={index === pageVariables.length - 1}
                            loadMore={(cursor) =>
                              setPageVariables([
                                ...pageVariables,
                                { take, cursor, username },
                              ])
                            }
                          />
                        );
                      })
                    ) : isMyProfile ? (
                      <div className="w-full mt-24 flex items-center justify-center">
                        <div className="h-20 w-96 text-center flex flex-col items-center justify-center space-y-3">
                          <Link href="/create">
                            <a className="border-2 border-gray-600 rounded-full p-3">
                              <SimplePlusIcon className="h-8 stroke-gray-600 stroke-1.5" />
                            </a>
                          </Link>
                          <h2 className="text-3xl font-light">Create a post</h2>
                          <p className="text-m">
                            Looks like you haven't created any posts yet.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full mt-24 flex items-center justify-center">
                        This user doesn't have any posts.
                      </div>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
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
      props: {},
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
      props: {},
    };
  } else {
    postsRes = await client
      ?.query(PostsByUserDocument, {
        take: take,
        username: params.username,
      })
      .toPromise();
  }

  return {
    props: {
      urqlState: ssrCache.extractData(),
      serverPosts: postsRes?.data.posts.posts,
      serverUser: userRes?.data.user,
    },
  };
}

export default withUrqlClient(urqlClient, {
  ssr: false,
})(UserProfile);
