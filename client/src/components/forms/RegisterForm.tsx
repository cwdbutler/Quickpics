import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  FieldError,
  useRegisterMutation,
} from "../../graphql/generated/graphql";
import { mapToFormErrors } from "../../utis/mapToFormErrors";
import * as Yup from "yup";
import { TickCircleIcon, XCircleIcon } from "../Icons";
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "../../utis/constants";

export default function RegisterForm() {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [registerErrors, setRegisterErrors] = useState<FieldError[]>();

  const styles = {
    field:
      "w-full h-9 text-xs rounded-s bg-background border-[1px] border-gray-300 outline-none",
  };

  const registerSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(),
    username: Yup.string()
      .max(MAX_USERNAME_LENGTH)
      .matches(/^[a-zA-Z0-9]+$/, "Usernames can only be alphanumeric")
      .required(),
    password: Yup.string()
      .min(MIN_PASSWORD_LENGTH)
      .max(MAX_PASSWORD_LENGTH)
      .required(),
  });

  return (
    <div className="w-[350px] space-y-3 leading-5">
      <div className=" border-[1px] border-gray-300 px-10 py-16 bg-white">
        <div className="my-7 pb-4 flex flex-col items-center justify-center border-b-[1px] border-b-gray-200">
          <h1 className="font-logo text-5xl mb-4">Quickpics</h1>
          <h3 className="font-semibold text-gray-500 text-center">
            Sign up to edit and share your photos with friends.
          </h3>
        </div>

        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
          }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setErrors }) => {
            const response = await register(values);
            if (response.data?.register.errors) {
              setErrors(mapToFormErrors(response.data.register.errors));
              setRegisterErrors(response.data.register.errors);
            } else if (response.data?.register.user) {
              router.push("/");
            }
          }}
        >
          {({ values, touched, errors, isValid, dirty }) => (
            <Form>
              <div className="space-y-2">
                <div className="relative">
                  <label className="relative" htmlFor="email">
                    <Field
                      className={`${values.email ? "pt-3 px-2" : "p-2"} ${
                        styles.field
                      }`}
                      id="email"
                      name="email"
                    />
                    <span
                      className={`${
                        values.email
                          ? "left-2.5 -top-3 text-xxs"
                          : "left-2.5 top-1 text-xs"
                      } absolute text-gray-500 pointer-events-none transition-all ease-linear duration-100`}
                    >
                      Email address
                    </span>
                  </label>
                  {touched.email &&
                    (errors.email ? (
                      <XCircleIcon className="absolute top-1 right-1 h-7 stroke-1 stroke-red-600 bg-background" />
                    ) : (
                      <TickCircleIcon className="absolute top-1 right-1 h-7 stroke-gray-500 stroke-1 bg-background" />
                    ))}
                </div>

                <div className="relative">
                  <label className="relative" htmlFor="username">
                    <Field
                      className={`${values.username ? "pt-3 px-2" : "p-2"} ${
                        styles.field
                      }`}
                      id="username"
                      name="username"
                    />
                    <span
                      className={`${
                        values.username
                          ? "left-2.5 -top-3 text-xxs"
                          : "left-2.5 top-1 text-xs"
                      } absolute text-gray-500 pointer-events-none transition-all ease-linear duration-100`}
                    >
                      Username
                    </span>
                  </label>
                  {touched.username &&
                    (errors.username ? (
                      <XCircleIcon className="absolute top-1 right-1 h-7 stroke-1 stroke-red-600 bg-background" />
                    ) : (
                      <TickCircleIcon className="absolute top-1 right-1 h-7 stroke-gray-500 stroke-1 bg-background" />
                    ))}
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
                    className={`absolute ${
                      touched.password ? "right-9" : "right-2"
                    } top-2 bg-background text-sm font-semibold`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {values.password ? (showPassword ? "Hide" : "Show") : ""}
                  </button>
                  {touched.password &&
                    (errors.password ? (
                      <XCircleIcon className="absolute top-1 right-1 h-7 stroke-1 stroke-red-600 bg-background" />
                    ) : (
                      <TickCircleIcon className="absolute top-1 right-1 h-7 stroke-gray-500 stroke-1 bg-background" />
                    ))}
                </div>
              </div>

              <div className="my-4">
                <button
                  type="submit"
                  disabled={!(isValid && dirty)}
                  className={`${
                    !(isValid && dirty) ? "bg-lightblue" : "bg-blue"
                  } text-white text-sm h-8 font-bold w-full rounded-m focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900`}
                >
                  Sign up
                </button>
              </div>

              {registerErrors && (
                <h3
                  aria-label="register errors"
                  className="text-red-600 text-sm text-center"
                >
                  {registerErrors[0].message}
                </h3>
              )}
            </Form>
          )}
        </Formik>

        <footer className="text-center text-xs mt-10">
          <p className="text-gray-400">
            This is a project made for learning purposes only. You can view the
            source code{" "}
            <a
              href="https://github.com/ConorButler/QuickPics"
              className="text-gray-900"
            >
              here.
            </a>
          </p>
        </footer>
      </div>
      <div className="border-[1px] h-[70px] border-gray-300 bg-white flex justify-center items-center">
        <p className="text-sm">Have an account?</p>
        <Link href="/login">
          <a className="ml-2 rounded-sm bg-white text-sm text-blue focus:outline-none focus:ring-2 focus:ring-offset-2">
            {" "}
            Log in
          </a>
        </Link>
      </div>
    </div>
  );
}
