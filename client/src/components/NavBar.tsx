import { withUrqlClient } from "next-urql";
import { urqlClient } from "../urqlClient";
import Link from "next/link";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "../graphql/generated/graphql";
import { isServer } from "../utis/isServer";

export default function NavBar() {
  const [{ data, fetching }] = useCurrentUserQuery({
    pause: isServer(),
  });
  const [, logout] = useLogoutMutation();
  return (
    <nav className="bg-indigo-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          <Link href="/">
            <button className="px-3 py-2 rounded-md flex-shrink-0 flex">
              <h1 className="text-white text-xl font-semibold">//QuickPics</h1>
            </button>
          </Link>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-end">
            {fetching || isServer() ? null : data?.currentUser ? (
              <div className="flex space-x-4">
                <Link href="/create">
                  <button className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium">
                    Create
                  </button>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
                <button className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium">
                  {data.currentUser.username}
                </button>
                <img
                  src={
                    data.currentUser.avatarUrl
                      ? data.currentUser.avatarUrl
                      : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  }
                  className="h-8 rounded-full"
                />
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
