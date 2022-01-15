import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>QuickPics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <header className="flex">
          <h1 className="text-6xl font-bold">//Quick</h1>
          <h1 className="text-indigo-600 text-6xl font-bold">Pics</h1>
        </header>

        <p className="mt-3 text-2xl">A photo sharing app</p>
      </main>
    </div>
  );
}
