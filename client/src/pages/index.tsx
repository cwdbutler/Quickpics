import Head from "next/head";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../urqlClient";
import {
  AllPostsQueryVariables,
  useAllPostsQuery,
} from "../graphql/generated/graphql";
import FeedPost from "../components/FeedPost";
import NavBar from "../components/NavBar";
import { useState } from "react";

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
      {fetching ? (
        <h3>Loading posts...</h3>
      ) : data ? (
        <>
          {data.allPosts.posts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
          {isLastPage && data.allPosts.hasMore && (
            // show the button at the bottom of the screen
            <button
              onClick={() => {
                if (data.allPosts) {
                  loadMore(
                    data.allPosts.posts[data.allPosts.posts.length - 1].id
                  );
                  // set the last post as the cursor
                }
              }}
              className="bg-indigo-700 text-white py-2 px-4 font-semibold m-4 rounded-md"
            >
              Load more
            </button>
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
    cursor: string | null;
  }

  const [pageVariables, setPageVariables] = useState<PageVariables[]>([
    {
      take: take, // how many posts to fetch
      cursor: null,
    },
  ]);

  // pageVariables stores an array of pages (of posts), and the variables requested to get each one
  // when pageVariables changes, it forces this component to rerender, and therefore rerender it's children (Page)
  // this creats a new Page component with the new variables (take and cursor), and extends the list

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>QuickPics</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="my-12 flex flex-col items-center w-full flex-1 px-20 text-center">
          {pageVariables.map((variables, index) => {
            return (
              <Page
                key={variables.cursor}
                variables={variables}
                isLastPage={index === pageVariables.length - 1}
                loadMore={(cursor) =>
                  setPageVariables([...pageVariables, { take, cursor }])
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Home);
