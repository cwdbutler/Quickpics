import { Form, Formik } from "formik";

export default function register() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-80 rounded-3xl mx-auto overflow-hidden shadow-xl border-gray-100 border-2">
        <div className="px-10 pt-32 pb-8 bg-white rounded-tr-4xl">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h1>
          <form className="mt-12" action="" method="POST">
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                placeholder=" "
              />
              <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm">
                Username
              </label>
            </div>
            <div className="mt-10 relative">
              <input
                id="password"
                type="password"
                name="password"
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                placeholder=" "
              />
              <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm">
                Password
              </label>
            </div>

            <input
              type="sumbit"
              value="Sign up"
              className="mt-20 px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer"
            />
          </form>
          <footer className="flex mt-4 justify-center">
            <p className="text-sm font-medium">Already have an account?</p>
            <a
              href="#"
              className="ml-2 text-sm font-semibold text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {" "}
              Log in
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
