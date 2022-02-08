import { initUrqlClient, withUrqlClient } from "next-urql";
import { urqlClient } from "../../urqlClient";
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from "urql";
import {
  CurrentUserDocument,
  PostsByUserDocument,
  PostsByUserQuery,
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
import { Fragment, useEffect, useState } from "react";
import { BookmarkIcon, GridIcon } from "../../components/Icons";

type Props = {
  serverUser: UserQuery["user"];
  serverSavedPosts: any;
};

function SavedPosts({ serverUser, serverSavedPosts }: Props) {
  if (!serverUser || !serverSavedPosts) {
    return <ErrorPage />;
  }

  const router = useRouter();

  const [{ data: userData }] = useUserQuery({
    variables: {
      username: serverUser.username,
    },
  });

  const [{ data: currentUserData }] = useCurrentUserQuery();

  const user = userData?.user!;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center py-2">
        <Head>
          <title>{user?.username}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="my-12 flex flex-col items-center w-full flex-1">
          <div className="w-full min-h-screen lg:w-[935px] flex flex-col">
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
                <div className="flex flex-col space-y-5">
                  <h2 className="text-3xl pt-1 font-light">{user.username}</h2>
                  <span>
                    <span className="font-semibold mr-1">{user.postCount}</span>
                    {`post${user.postCount > 1 ? "s" : ""}`}
                  </span>
                </div>
              </section>
            </header>
            <section className="w-full mt-10 border-gray-300 border-t-[1px]">
              <Tab.Group
                defaultIndex={1}
                onChange={(_index) => {
                  router.push(`/${user.username}`);
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
                      userData?.user?.username && (
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
                  <Tab.Panel className="">saved posts</Tab.Panel>
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
      savedPosts = [];
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
