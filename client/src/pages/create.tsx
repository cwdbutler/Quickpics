import { withUrqlClient } from "next-urql";
import Head from "next/head";
import CreatePostForm from "../components/forms/CreatePostForm";
import { urqlClient } from "../urqlClient";

function create() {
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
