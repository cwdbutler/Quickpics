import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLoginMutation } from "../graphql/generated/graphql";
import { mapToFormErrors } from "../utis/mapToFormErrors";

export default function LoginForm() {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <div className="w-96 rounded-sm mx-auto overflow-hidden shadow-lg border-2 border-gray-50">
      <div className="px-10 pt-24 pb-12 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900 mb-16 pb-4 border-b-2 border-gray-300">
          Welcome back
        </h1>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(mapToFormErrors(response.data.login.errors));
            } else if (response.data?.login.user) {
              router.push("/");
            }
          }}
        >
          <Form>
            <div className="relative mt-10">
              <Field
                className="peer h-10 w-full border-2 px-2 pt-7 pb-3 text-xs rounded-sm border-gray-300 text-gray-900 placeholder-transparent transition-colors focus:outline-none focus:border-indigo-600"
                id="username"
                name="username"
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="px-2.5 pt-2 absolute left-0 -top-0.5 text-gray-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-0.5 peer-focus:-top-0.5 peer-focus:text-xs"
              >
                Username
              </label>

              <ErrorMessage
                component="div"
                className="my-2 absolute text-xs text-red-600 font-semibold"
                name="username"
              />
            </div>

            <div className="relative mt-10">
              <Field
                className="peer h-10 w-full border-2 px-2 pt-7 pb-3 text-xs rounded-sm border-gray-300 text-gray-900 placeholder-transparent transition-colors focus:outline-none focus:border-indigo-600"
                id="password"
                name="password"
                placeholder=" "
                type="password"
              />
              <label
                htmlFor="password"
                className="px-2.5 pt-2 absolute left-0 -top-0.5 text-gray-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-0.5 peer-focus:-top-0.5 peer-focus:text-xs"
              >
                Password
              </label>
            </div>
            <ErrorMessage
              component="div"
              className="my-2 absolute text-xs text-red-600 font-semibold"
              name="password"
            />

            <div className="mt-16">
              <button
                type="submit"
                className="bg-indigo-700 text-white font-bold py-2 px-4 w-full rounded-sm focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Log in
              </button>
            </div>

            <footer className="flex mt-4 justify-center">
              <p className="text-sm font-medium">Don't have an account?</p>
              <Link href="/register">
                <a className="ml-2 rounded-sm bg-white text-sm font-semibold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {" "}
                  Sign up
                </a>
              </Link>
            </footer>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
