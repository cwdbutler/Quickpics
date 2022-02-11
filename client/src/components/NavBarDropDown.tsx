import { Menu, Transition, Popover } from "@headlessui/react";
import Image from "next/image";
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

  console.log(router.asPath);
  console.log(router.asPath.startsWith(`/${user.username}`));

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center justify-center w-full p-0.5">
        <div
          className={`${
            router.asPath.startsWith(`/${user.username}`) &&
            "overflow-hidden aspect-square border-[1px] border-black"
          } rounded-full select-none flex`}
        >
          <Image
            objectFit="cover"
            width={28}
            height={28}
            src={user.avatarUrl ? user.avatarUrl : "/default.jpg"}
          />
        </div>
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
              <Link href={`/${user.username}/saved`}>
                <a className="group flex items-center w-full p-3 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-200 focus-visible:bg-gray-200">
                  <BookmarkIcon className="h-5 mr-2 stroke-1.5" />
                  Saved
                </a>
              </Link>
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
