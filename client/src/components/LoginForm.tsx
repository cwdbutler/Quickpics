import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLoginMutation } from "../graphql/generated/graphql";
import { mapToFormErrors } from "../utis/mapToFormErrors";

export default function LoginForm() {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <div className="w-80 rounded-md mx-auto overflow-hidden shadow-lg border-2 border-gray-50">
      <div className="px-6 pt-12 pb-12 bg-white rounded-tr-4xl">
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
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                id="username"
                name="username"
                placeholder=" "
              />
              <label className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm">
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
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                id="password"
                name="password"
                placeholder=" "
                type="password"
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm"
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
                className="bg-indigo-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:bg-indigo-500"
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
