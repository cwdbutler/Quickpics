import Link from "next/link";
import { useCurrentUserQuery } from "../graphql/generated/graphql";

export default function NavBar() {
  const [{ data }] = useCurrentUserQuery();
  return (
    <nav className="bg-indigo-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          <Link href="/">
            <button className="w-8 rounded-md flex-shrink-0 flex items-center justify-center hover:bg-gray-900">
              <h1 className="text-xl text-white">//</h1>
            </button>
          </Link>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-end">
            {data?.currentUser ? (
              <div className="flex space-x-4">
                <button className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium">
                  {data.currentUser.username}
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login">
                  <button className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium">
                    Log in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
