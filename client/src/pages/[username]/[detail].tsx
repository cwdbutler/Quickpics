import { initUrqlClient, withUrqlClient } from "next-urql";
import { urqlClient } from "../../urqlClient";
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from "urql";
import {
  CurrentUserDocument,
  SavedPostsDocument,
  SavedPostsQuery,
  SavedPostsQueryVariables,
  useCurrentUserQuery,
  UserDocument,
  UserQuery,
  useSavedPostsQuery,
  useUserQuery,
} from "../../graphql/generated/graphql";
import PostPreview from "../../components/post/PostPreview";
import ErrorPage from "../404";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import Head from "next/head";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BookmarkIcon, GridIcon } from "../../components/Icons";
import { Waypoint } from "react-waypoint";
import Image from "next/image";
import ProfilePicForm from "../../components/forms/ProfilePicForm";
import Spinner from "../../components/Spinner";

interface PageProps {
  variables: SavedPostsQueryVariables;
  isLastPage: boolean;
  loadMore: (cursor: string) => void;
}

function Page({ variables, isLastPage, loadMore }: PageProps) {
  const [{ data, fetching }] = useSavedPostsQuery({
    variables,
  });

  const posts = data?.savedPosts.posts;
  const hasMore = data?.savedPosts.hasMore;

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
              loadMore(
                data.savedPosts.posts[data.savedPosts.posts.length - 1].id
              );
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
  serverSavedPosts: SavedPostsQuery["savedPosts"]["posts"];
};

interface PageVariables {
  take: number;
  cursor?: string;
}
const take = 12;

function SavedPosts({ serverUser, serverSavedPosts }: Props) {
  if (!serverUser || !serverSavedPosts) {
    return <ErrorPage />;
  } // this isn't the current user's profile so they cannot access this

  const router = useRouter();

  const [{ data }] = useUserQuery({
    variables: {
      username: serverUser.username,
    },
  });

  const [{ data: currentUserData }] = useCurrentUserQuery();

  const [pageVariables, setPageVariables] = useState<PageVariables[]>([
    {
      take: take,
    },
  ]);

  return (
    <>
      <NavBar />
      <Head>
        <title>{serverUser.username} • Quickpics</title>
      </Head>
      <div className="flex flex-col pr-[16px] lg:pr-0 items-center justify-center py-2">
        <div className="my-6 flex flex-col items-center w-full flex-1">
          <div className="w-full min-h-screen lg:w-[935px] flex flex-col">
            <header className="flex">
              <div className="mx-20 select-none flex flex-col items-center relative">
                <ProfilePicForm user={data?.user} />
              </div>
              <section aria-label="User information" className="flex-grow">
                <div className="flex flex-col space-y-5">
                  <h2 className="text-3xl pt-1 font-light">
                    {serverUser.username}
                  </h2>
                  <span>
                    <span className="font-semibold mr-1">
                      {serverUser.postCount}
                    </span>
                    {`post${serverUser.postCount > 1 ? "s" : ""}`}
                  </span>
                </div>
              </section>
            </header>
            <section className="w-full mt-10 border-gray-300 border-t-[1px]">
              <Tab.Group
                manual
                defaultIndex={1}
                onChange={(_index) => {
                  router.push(`/${serverUser.username}`);
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
                    {currentUserData?.currentUser?.username ===
                      serverUser.username && (
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
                  <Tab.Panel>
                    {/* this tab doesn't get used, it's just for the order */}
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="flex w-full mt-8 mb-4">
                      <h4 className="text-xs px-4 lg:px-0 text-gray-500">
                        Only you can see what you've saved
                      </h4>
                    </div>
                    {serverSavedPosts && serverSavedPosts.length > 0 ? (
                      pageVariables.map((variables, index) => {
                        return (
                          <Page
                            key={"key" + variables.cursor} // cursor is null for first page
                            variables={variables}
                            isLastPage={index === pageVariables.length - 1}
                            loadMore={(cursor) =>
                              setPageVariables([
                                ...pageVariables,
                                { take, cursor },
                              ])
                            }
                          />
                        );
                      })
                    ) : (
                      <div className="w-full mt-24 flex items-center justify-center">
                        <div className="h-20 w-96 text-center flex flex-col items-center justify-center space-y-3">
                          <div className="border-2 border-gray-600 rounded-full p-3">
                            <BookmarkIcon className="h-8 " />
                          </div>
                          <h2 className="text-3xl font-light">Save</h2>
                          <p className="text-m">
                            Save posts that you want to see again. Only you can
                            see what you've saved.
                          </p>
                        </div>
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
  if (!params.username.match(/^[a-zA-Z0-9]+$/) || params.detail !== "saved") {
    return {
      props: {},
    };
  } // only have /saved for now, but can add more

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

  let savedPosts = null;
  if (!userRes?.data.user) {
    // if that user doesn't exist, don't try and fetch their posts
    return {
      props: {},
    };
  } else {
    const currentUserRes = await client?.query(CurrentUserDocument).toPromise();
    // if this is the currentUsers profile
    // fetch their saved posts
    if (currentUserRes?.data.currentUser.username === params.username) {
      const savedPostsRes = await client
        ?.query(SavedPostsDocument, { take: take })
        .toPromise();
      savedPosts = savedPostsRes?.data.savedPosts.posts;
    }
  }

  return {
    props: {
      urqlState: ssrCache.extractData(),
      serverUser: userRes?.data.user,
      serverSavedPosts: savedPosts,
    },
  };
}

export default withUrqlClient(urqlClient, {
  ssr: false,
})(SavedPosts);
