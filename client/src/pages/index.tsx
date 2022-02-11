import Head from "next/head";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../urqlClient";
import {
  AllPostsQueryVariables,
  useAllPostsQuery,
  useCurrentUserQuery,
  useSuggestedUsersQuery,
} from "../graphql/generated/graphql";
import FeedPost from "../components/FeedPost";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
import Link from "next/link";
import Image from "next/image";

interface Props {
  variables: AllPostsQueryVariables;
  isLastPage: boolean;
  loadMore: (cursor: string) => void;
}

function Page({ variables, isLastPage, loadMore }: Props) {
  const [{ data, fetching }] = useAllPostsQuery({
    variables,
  });

  return (
    <main>
      {data ? (
        <>
          {data.posts.posts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
          {isLastPage && data.posts.hasMore && (
            // when this becomes visible on the screen, it loads more posts
            <Waypoint
              onEnter={() => {
                if (data.posts) {
                  loadMore(data.posts.posts[data.posts.posts.length - 1].id);
                }
              }}
            />
          )}
        </>
      ) : fetching ? (
        <div>Loading...</div>
      ) : (
        <div>no posts</div>
      )}
    </main>
  );
}

const take = 10;

function Home() {
  interface PageVariables {
    take: number;
    cursor?: string;
  }

  const [pageVariables, setPageVariables] = useState<PageVariables[]>([
    {
      take: take, // how many posts to fetch
    },
  ]);

  // pageVariables stores an array of pages (of posts), and the variables requested to get each one
  // when pageVariables changes, it forces this component to rerender, and therefore rerender it's children (Page)
  // this creats a new Page component with the new variables (take and cursor), and extends the list

  const [{ data: usersData }] = useSuggestedUsersQuery();

  const [{ data: currentUserData }] = useCurrentUserQuery();

  return (
    <div className="w-full">
      <NavBar />
      <Head>
        <title>Quickpics</title>
      </Head>
      <div className="flex pr-[16px] sm:pr-0 justify-center">
        <div className="w-full md:w-[990px] lg:grid lg:grid-cols-3 my-12">
          <div className="lg:col-span-2 flex flex-col items-center w-full flex-1">
            {pageVariables.map((variables, index) => {
              return (
                <Page
                  key={"key" + variables.cursor} // cursor is null for first page
                  variables={variables}
                  isLastPage={index === pageVariables.length - 1}
                  loadMore={(cursor) =>
                    setPageVariables([...pageVariables, { take, cursor }])
                  }
                />
              );
            })}
          </div>
          <div className="w-full invisible lg:visible relative">
            <div className="fixed">
              <h3 className="mb-4 text-m font-semibold text-gray-400">
                Suggested profiles
              </h3>
              <ul className="space-y-4 pl-2">
                {usersData?.suggestedUsers
                  ?.filter(
                    (user) => currentUserData?.currentUser?.id !== user.id
                  )
                  .map((user) => (
                    <li key={user.username} className="flex items-center w-72">
                      <Link href={`/${user.username}`}>
                        <a className="mr-3 flex">
                          <Image
                            width={32}
                            height={32}
                            src={
                              user.avatarUrl ? user.avatarUrl : "/default.jpg"
                            }
                            className="rounded-full select-none flex-none"
                            draggable={false}
                          />
                        </a>
                      </Link>
                      <Link href={`/${user.username}`}>
                        <a>
                          <h3 className="hover:underline w-full font-semibold text-m flex-initial">
                            {user.username}
                          </h3>
                        </a>
                      </Link>
                      <Link href={`/${user.username}`}>
                        <a className="text-blue text-xs font-semibold pr-2 ml-auto">
                          View
                        </a>
                      </Link>
                    </li>
                  ))
                  .slice(0, 5)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Home);
