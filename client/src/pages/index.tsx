import Head from "next/head";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../urqlClient";
import { useAllPostsQuery } from "../graphql/generated/graphql";

function Home() {
  const [{ data, fetching }] = useAllPostsQuery();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>QuickPics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="my-12 flex flex-col items-center w-full flex-1 px-20 text-center">
        <header className="flex">
          <h1 className="text-6xl font-bold">//Quick</h1>
          <h1 className="text-indigo-600 text-6xl font-bold">Pics</h1>
        </header>

        <section className="mt-12">
          {fetching ? (
            <h3>Loading posts...</h3>
          ) : (
            data?.allPosts.map((post) => (
              <article key={post.id}>
                <img src={post.imageUrl} alt="" />
                <h2>{post.author.username}</h2>
                {post.caption}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
export default withUrqlClient(urqlClient, { ssr: true })(Home);
