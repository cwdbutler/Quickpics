import { Menu, Transition, Popover } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import {
  useLogoutMutation,
  UserInfoFragment,
} from "../graphql/generated/graphql";
import { BookmarkIcon, UserIcon } from "./Icons";

type Props = {
  user: UserInfoFragment;
};

export default function NavBarDropDown({ user }: Props) {
  const [, logout] = useLogoutMutation();
  const router = useRouter();

  return (
    <Popover className="relative h-8">
      <Popover.Button className="inline-flex items-center justify-center w-full p-0.5">
        <img
          src={
            user.avatarUrl
              ? user.avatarUrl
              : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          }
          className="h-7 rounded-full select-none"
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="overflow-clip absolute right-0 w-56 mt-2 origin-top-right divide-y divide-gray-300 bg-white rounded-m shadow-[0_0_5px_2px_rgba(0,0,0,0.1)]">
          <div>
            <div className="flex w-full">
              <Link href={`/${user.username}`}>
                <a className="group flex items-center w-full p-3 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-200 focus-visible:bg-gray-200">
                  <UserIcon className="h-5 mr-2 stroke-1.5" />
                  Profile
                </a>
              </Link>
            </div>
            <div className="flex w-full">
              <a className="group flex items-center w-full p-3 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-200 focus-visible:bg-gray-200">
                <BookmarkIcon className="h-5 mr-2 stroke-1.5" />
                Saved
              </a>
            </div>
          </div>
          <div>
            <div className="flex w-full">
              <button
                onClick={async () => {
                  const response = await logout();
                  if (response.data?.logout) {
                    router.push("/");
                  }
                }}
                className="group flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-200 focus-visible:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

// overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5

{
  /* <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center w-full p-0.5">
          <img
            src={
              user.avatarUrl
                ? user.avatarUrl
                : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
            }
            className="h-7 rounded-full select-none"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="overflow-clip absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-300 rounded-md shadow-md">
          <div>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-background" : "text-gray-900"
                  } group flex items-center w-full p-3 text-sm ring-1 ring-indigo-500 ring-opacity-5 focus:outline-none`}
                >
                  <UserIcon className="h-5 mr-2 stroke-1.5" />
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-background" : "text-gray-900"
                  } group flex items-center w-full p-3 text-sm`}
                >
                  <BookmarkIcon className="h-5 mr-2 stroke-1.5" />
                  Saved
                </button>
              )}
            </Menu.Item>
          </div>
          <div>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-background" : "text-gray-900"
                  } group flex items-center w-full px-4 py-3 text-sm`}
                  onClick={async () => {
                    const response = await logout();
                    if (response.data?.logout) {
                      router.push("/");
                    }
                  }}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu> */
}
