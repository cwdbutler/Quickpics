import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import {
  useCommentLikesQuery,
  usePostLikesQuery,
} from "../../graphql/generated/graphql";
import { XIcon } from "../Icons";

type Props = {
  likesOpen: boolean;
  setLikesOpen: (open: boolean) => void;
  entityId: string;
  type: "post" | "comment";
};

export default function LikesModal({
  entityId,
  likesOpen,
  setLikesOpen,
  type,
}: Props) {
  let likes;
  if (type === "post") {
    const [{ data }] = usePostLikesQuery({
      pause: !likesOpen,
      variables: {
        id: entityId,
      },
    });
    likes = data?.post?.likes;
  }
  if (type === "comment") {
    const [{ data }] = useCommentLikesQuery({
      pause: !likesOpen,
      variables: {
        id: entityId,
      },
    });
    likes = data?.comment?.likes;
  }

  return (
    <Transition.Root show={likesOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0" onClose={setLikesOpen}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-modal bg-opacity-50 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden align-middle rounded-xl w-[260px] sm:w-[400px] bg-white text-left shadow-xl transform transition-all sm:my-8">
              <div className="bg-white divide-y divide-gray-300">
                <div className="p-1 flex items-center justify-between">
                  <div className="w-9" />
                  <Dialog.Title
                    as="h3"
                    className="text-md font-semibold text-center text-gray-900"
                  >
                    Likes
                  </Dialog.Title>
                  <button onClick={() => setLikesOpen(false)}>
                    <XIcon className="h-9 stroke-1.5" />
                  </button>
                </div>
                <div className="h-[352px] overflow-auto p-2">
                  {!likes ? (
                    <div className="w-full h-full flex items-center justify-center">
                      Loading...
                    </div>
                  ) : (
                    likes.map((like) => (
                      <div
                        key={like.likedAt}
                        className="flex w-full items-center justify-between p-2"
                      >
                        <div className="flex items-center space-x-3">
                          <Link href={`/${like.author.username}`}>
                            <a>
                              <Image
                                draggable={false}
                                objectFit="cover"
                                width={45}
                                height={45}
                                src={
                                  like.author.avatarUrl
                                    ? like.author.avatarUrl
                                    : "/default.jpg"
                                }
                                className="rounded-full"
                              />
                            </a>
                          </Link>
                          <Link href={`/${like.author.username}`}>
                            <a className="font-semibold text-m hover:underline">
                              {like.author.username}
                            </a>
                          </Link>
                        </div>
                        <Link href={`/${like.author.username}`}>
                          <button
                            type="button"
                            className="bg-blue text-m text-white px-2 py-1 rounded-m font-semibold"
                          >
                            View
                          </button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
