import Link from "next/link";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "../graphql/generated/graphql";
import { isServer } from "../utis/isServer";
import { HomeIcon, HomeIconFilled, PlusIcon } from "./Icons";
import router from "next/router";

export default function NavBar() {
  const [{ data, fetching }] = useCurrentUserQuery({
    pause: isServer(),
  });
  const [, logout] = useLogoutMutation();

  return (
    <nav className="bg-white sticky top-0 z-10 border-b-[1px] border-gray-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          <Link href="/">
            <button className="px-3 py-2 rounded-md flex-shrink-0 flex">
              <h1 className="font-logo text-3xl">Quickpics</h1>
            </button>
          </Link>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-end">
            {fetching || isServer() ? null : data?.currentUser ? (
              // user is logged in
              <div className="flex items-center justify-center space-x-4">
                <Link href="/">
                  <button>
                    {router.pathname === "/" ? (
                      <HomeIconFilled className="h-8" />
                    ) : (
                      <HomeIcon className="h-8" />
                    )}
                  </button>
                </Link>
                <Link href="/create">
                  <button>
                    <PlusIcon className="h-8 stroke-1.5" />
                  </button>
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
                <button className="px-3 py-2 rounded-md text-sm font-medium">
                  {data.currentUser.username}
                </button>
                <img
                  src={
                    data.currentUser.avatarUrl
                      ? data.currentUser.avatarUrl
                      : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  }
                  className="h-7 rounded-full"
                />
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login">
                  <button className="px-3 py-2 rounded-md text-sm font-medium">
                    Log in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-3 py-2 rounded-md text-sm font-medium">
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
