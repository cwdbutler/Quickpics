import Head from "next/head";
import RegisterForm from "../components/RegisterForm";

export default function register() {
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
