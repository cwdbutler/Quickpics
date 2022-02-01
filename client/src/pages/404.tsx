import NavBar from "../components/NavBar";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col h-40 items-center justify-center text-center p-12 space-y-6">
        <h1 className="text-2xl font-semibold">
          Sorry, this page isn't available.
        </h1>
        <p className="float-left">
          The link you followed may be broken, or the page may have been
          removed.
          <Link href="/">
            <a className="ml-1 text-blue">Go back to Quickpics.</a>
          </Link>
        </p>
      </div>
    </>
  );
}
