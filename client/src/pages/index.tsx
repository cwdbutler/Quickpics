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
import { Waypoint } from "react-waypoint";

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

  return (
    <div className="w-full">
      <NavBar />
      <div className="flex flex-col items-center justify-center py-2">
        <Head>
          <title>QuickPics</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="my-12 flex flex-col items-center w-full flex-1">
          {pageVariables.map((variables, index) => {
            return (
              <Page
                key={variables.cursor || "key"} // cursor is null for first page
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
    </div>
  );
}

export default withUrqlClient(urqlClient, { ssr: true })(Home);
