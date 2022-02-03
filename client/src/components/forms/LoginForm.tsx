import { Formik, Field, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { FieldError, useLoginMutation } from "../../graphql/generated/graphql";
import { mapToFormErrors } from "../../utis/mapToFormErrors";
import { useState } from "react";

export default function LoginForm() {
  const [, login] = useLoginMutation();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loginErrors, setLoginErrors] = useState<FieldError[]>();

  const styles = {
    field:
      "w-full h-9 text-xs rounded-s bg-background border-[1px] border-gray-300 outline-none",
  };

  return (
    <div className="w-[350px] space-y-3 leading-5">
      <div className=" border-[1px] border-gray-300 p-10 bg-white">
        <div className="my-7  flex flex-col items-center justify-center">
          <h1 className="font-logo text-5xl mb-4">Quickpics</h1>
        </div>

        <Formik
          initialValues={{
            emailOrUsername: "",
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(mapToFormErrors(response.data.login.errors));
              setLoginErrors(response.data.login.errors);
            } else if (response.data?.login.user) {
              if (router.query.from) {
                router.push(router.query.from as string);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ values }) => (
            <Form>
              <div className="space-y-2">
                <div className="relative">
                  <label className="relative" htmlFor="email">
                    <Field
                      className={`${
                        values.emailOrUsername ? "pt-3 px-2" : "p-2"
                      } ${styles.field}`}
                      id="emailOrUsername"
                      name="emailOrUsername"
                    />
                    <span
                      className={`${
                        values.emailOrUsername
                          ? "left-2.5 -top-3 text-xxs"
                          : "left-2.5 top-1 text-xs"
                      } absolute text-gray-500 pointer-events-none transition-all ease-linear duration-100`}
                    >
                      Username or email address
                    </span>
                  </label>
                </div>

                <div className="relative">
                  <label className="relative" htmlFor="password">
                    <Field
                      className={`${values.password ? "pt-3 px-2" : "p-2"} ${
                        styles.field
                      } pr-[4.5rem]`}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                    />
                    <span
                      className={`${
                        values.password
                          ? "left-2.5 -top-3 text-xxs"
                          : "left-2.5 top-1 text-xs"
                      } absolute text-gray-500 pointer-events-none transition-all ease-linear duration-100`}
                    >
                      Password
                    </span>
                  </label>
                  <button
                    type="button"
                    className={`absolute right-2 top-2 bg-background text-sm font-semibold`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {values.password ? (showPassword ? "Hide" : "Show") : ""}
                  </button>
                </div>
              </div>

              <div className="my-4">
                <button
                  type="submit"
                  disabled={
                    !Object.values(values).every((value) => value.length > 0)
                  }
                  className={`${
                    !Object.values(values).every((value) => value.length > 0)
                      ? "bg-lightblue"
                      : "bg-blue"
                  } text-white text-sm h-8 font-bold w-full rounded-m focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900`}
                >
                  Log in
                </button>
              </div>

              {loginErrors && (
                <h3
                  aria-label="register errors"
                  className="text-red-600 text-sm text-center"
                >
                  {loginErrors[0].message}
                </h3>
              )}
            </Form>
          )}
        </Formik>
      </div>

      <div className="border-[1px] h-[70px] border-gray-300 bg-white flex justify-center items-center">
        <p className="text-sm">Don't have an account?</p>
        <Link href="/register">
          <a className="ml-2 rounded-sm bg-white text-sm text-blue"> Sign up</a>
        </Link>
      </div>
    </div>
  );
}
