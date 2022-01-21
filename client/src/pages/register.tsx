import { withUrqlClient } from "next-urql";
import Head from "next/head";
import RegisterForm from "../components/forms/RegisterForm";
import { urqlClient } from "../urqlClient";
import login from "./login";

function register() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <RegisterForm />
    </div>
  );
}

export default withUrqlClient(urqlClient)(register);
