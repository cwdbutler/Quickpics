import Head from "next/head";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../urqlClient";
import {
  AllPostsQueryVariables,
  useAllPostsQuery,
  useSuggestedUsersQuery,
} from "../graphql/generated/graphql";
import FeedPost from "../components/FeedPost";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
import Link from "next/link";

interface Props {
  variables: AllPostsQueryVariables;
  isLastPage: boolean;
  loadMore: (cursor: string) => void;
}

function Page({ variables, isLastPage, loadMore }: Props) {
  const [{ data }] = useAllPostsQuery({
    variables,
  });
  // don't check for fetching because it is already fetched server side

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

  return (
    <div className="w-full">
      <NavBar />
      <div className="flex flex-col items-center justify-center py-2">
        <Head>
          <title>QuickPics</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </div>
      <div className="flex justify-center">
        <div className="w-full md:w-[990px] lg:grid lg:grid-cols-3 my-12">
          <div className=" lg:col-span-2 flex flex-col items-center w-full flex-1">
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
              <ul className="space-y-4 px-2">
                {usersData?.suggestedUsers?.map((user) => (
                  <li className="flex items-center">
                    <Link href={`/${user.username}`}>
                      <a>
                        <img
                          src={
                            user.avatarUrl
                              ? user.avatarUrl
                              : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                          }
                          className="h-8 rounded-full select-none mr-3"
                          draggable={false}
                        />
                      </a>
                    </Link>
                    <Link href={`/${user.username}`}>
                      <a>
                        <h3 className="hover:underline font-semibold text-m">
                          {user.username}
                        </h3>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Home);
