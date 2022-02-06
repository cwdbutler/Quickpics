import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CreatePostForm from "../components/forms/CreatePostForm";
import NavBar from "../components/NavBar";
import { useCurrentUserQuery } from "../graphql/generated/graphql";
import { urqlClient } from "../urqlClient";

function create() {
  const router = useRouter();

  const [{ data, fetching }] = useCurrentUserQuery();
  useEffect(() => {
    if (!fetching && !data?.currentUser) {
      router.push({ pathname: "/login", query: { from: router.pathname } });
    }
  }, [data, router, fetching]);

  return (
    <>
      <Head>
        <title>Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <CreatePostForm />
        </div>
      </div>
    </>
  );
}

export default withUrqlClient(urqlClient)(create);
