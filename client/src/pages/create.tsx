import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CreatePostForm from "../components/forms/CreatePostForm";
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
    <div className="min-h-screen flex justify-center items-center">
      <Head>
        <title>Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CreatePostForm />
    </div>
  );
}

export default withUrqlClient(urqlClient)(create);
