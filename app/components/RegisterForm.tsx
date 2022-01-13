import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <div className="w-80 rounded-3xl mx-auto overflow-hidden shadow-lg border-2 border-gray-50">
      <div className="px-10 pt-28 pb-8 bg-white rounded-tr-4xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Create your account
        </h1>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          <Form>
            <div className="relative mt-6">
              <Field
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                id="username"
                name="username"
                placeholder=" "
              />
              <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm">
                Username
              </label>
            </div>

            <div className="relative mt-6">
              <Field
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                id="password"
                name="password"
                placeholder=" "
                type="password"
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm"
              >
                Password
              </label>
            </div>
            <ErrorMessage name="username" />

            <div className="mt-8">
              <button
                type="submit"
                className="bg-indigo-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 "
              >
                Sign up
              </button>
            </div>

            <footer className="flex mt-4 justify-center">
              <p className="text-sm font-medium">Already have an account?</p>
              <Link href="/login">
                <a className="ml-2 rounded-sm bg-white text-sm font-semibold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {" "}
                  Log in
                </a>
              </Link>
            </footer>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
