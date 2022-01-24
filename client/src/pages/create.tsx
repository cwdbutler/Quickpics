import { withUrqlClient } from "next-urql";
import Head from "next/head";
import router from "next/router";
import { useEffect } from "react";
import CreatePostForm from "../components/forms/CreatePostForm";
import { useCurrentUserQuery } from "../graphql/generated/graphql";
import { urqlClient } from "../urqlClient";

function create() {
  const [{ data, fetching }] = useCurrentUserQuery();
  useEffect(() => {
    if (!fetching && !data?.currentUser) {
      router.replace("/login");
    }
  }, [data, router, fetching]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CreatePostForm />
    </div>
  );
}

export default withUrqlClient(urqlClient)(create);
