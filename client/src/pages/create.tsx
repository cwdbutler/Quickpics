import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import CreatePostForm from "../components/forms/CreatePostForm";
import { mapToFormErrors } from "../utis/mapToFormErrors";
import login from "./login";

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

export default create;
