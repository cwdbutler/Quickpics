import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import RegisterForm from "../components/forms/RegisterForm";
import { useCurrentUserQuery } from "../graphql/generated/graphql";
import { urqlClient } from "../urqlClient";

function register() {
  const [{ data, fetching }] = useCurrentUserQuery();

  const router = useRouter();

  useEffect(() => {
    if (!fetching && data?.currentUser) {
      router.back();
    }
  }, [fetching, data]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Head>
        <title>Register • Quickpics</title>
      </Head>

      <RegisterForm />
    </div>
  );
}

export default withUrqlClient(urqlClient)(register);
