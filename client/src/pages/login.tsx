import Head from "next/head";
import LoginForm from "../components/LoginForm";

export default function login() {
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
