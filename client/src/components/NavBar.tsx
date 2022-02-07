import Link from "next/link";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "../graphql/generated/graphql";
import { isServer } from "../utis/isServer";
import { HomeIcon, HomeIconFilled, PlusIcon, PlusIconFilled } from "./Icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [{ data, fetching }] = useCurrentUserQuery({
    pause: isServer(),
  });
  const [, logout] = useLogoutMutation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  // fixing server/html mismatch warning error

  const router = useRouter();

  return !mounted ? null : (
    <nav className="bg-white sticky top-0 z-10 border-b-[1px] border-gray-300">
      <div className="max-w-[990px] mx-auto px-6">
        <div className="relative flex items-center justify-between h-14">
          <Link href="/">
            <button className="px-3 py-2 rounded-md flex-shrink-0 flex">
              <h1 className="font-logo text-3xl">Quickpics</h1>
            </button>
          </Link>
          <div className="flex-1 flex items-stretch justify-end mr-2">
            {fetching || isServer() ? null : data?.currentUser ? (
              // user is logged in
              <div className="flex items-center justify-center space-x-4">
                <Link href="/">
                  <button>
                    {router.pathname === "/" ? (
                      <HomeIconFilled className="h-8" />
                    ) : (
                      <HomeIcon className="h-8 stroke-1.5" />
                    )}
                  </button>
                </Link>
                <Link href="/create">
                  <button>
                    {router.pathname === "/create" ? (
                      <PlusIconFilled className="h-8" />
                    ) : (
                      <PlusIcon className="h-8" />
                    )}
                  </button>
                </Link>
                <button
                  onClick={async () => {
                    const response = await logout();
                    if (response.data?.logout) {
                      router.push("/");
                    }
                  }}
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
                  className="h-7 rounded-full select-none"
                />
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    router.push({
                      pathname: "/login",
                      query: { from: router.asPath },
                    });
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </button>

                <button
                  onClick={() => {
                    router.push({
                      pathname: "/register",
                      query: { from: router.asPath },
                    });
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
