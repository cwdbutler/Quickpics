import { withUrqlClient } from "next-urql";
import { urqlClient } from "../urqlClient";
import Link from "next/link";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "../graphql/generated/graphql";

function NavBar() {
  const [{ data, fetching }] = useCurrentUserQuery();
  const [, logout] = useLogoutMutation();

  const loggedInButtons = (user: string) => (
    <div className="flex space-x-4">
      <button className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium">
        {user}
      </button>
      <button
        onClick={() => logout()}
        className="text-white hover:bg-gray-900  px-3 py-2 rounded-md text-sm font-medium"
      >
        Logout
      </button>
    </div>
  );
  const notLoggedInButtons = (
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
  );

  return (
    <nav className="bg-indigo-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          <Link href="/">
            <button className="px-3 py-2 rounded-md flex-shrink-0 flex">
              <h1 className="text-white text-xl font-semibold">//QuickPics</h1>
            </button>
          </Link>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-end">
            {fetching
              ? null
              : data?.currentUser
              ? loggedInButtons(data.currentUser.username)
              : notLoggedInButtons}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default withUrqlClient(urqlClient)(NavBar);
