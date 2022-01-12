import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>QuickPhotos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          //Quick
          <a className="text-blue-600" href="https://nextjs.org">
            Photos
          </a>
        </h1>

        <p className="mt-3 text-2xl">A photo sharing app</p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Log in</h3>
          </div>
          <Link href="/register">
            <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 hover:cursor-pointer">
              <h3 className="text-2xl font-bold">Sign up</h3>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
