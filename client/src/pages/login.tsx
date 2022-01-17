import { withUrqlClient } from "next-urql";
import Head from "next/head";
import LoginForm from "../components/LoginForm";
import { urqlClient } from "../urqlClient";

function login() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoginForm />
    </div>
  );
}

export default withUrqlClient(urqlClient)(login);
