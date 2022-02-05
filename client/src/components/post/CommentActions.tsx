import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  CurrentUserQuery,
  useDeleteCommentMutation,
} from "../../graphql/generated/graphql";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  commentId: string;
  user?: CurrentUserQuery["currentUser"];
};

export default function CommentActions({ open, setOpen, commentId }: Props) {
  const [, deleteComment] = useDeleteCommentMutation();

  const styles = {
    option: "text-m text-center text-gray-900 py-4",
  };

  const router = useRouter();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0" onClose={setOpen}>
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
                {/* only the author will see this modal anyway, so don't check this here */}
                <Dialog.Title as="h3" className={styles.option}>
                  <button
                    className="font-bold text-red-600"
                    onClick={async () => {
                      const response = await deleteComment({ id: commentId });
                      if (
                        response.data &&
                        !response.data.deleteComment.errors
                      ) {
                        setOpen(false);
                        // should add a loader or something here
                      }
                      // need to handle this and display an error message
                    }}
                  >
                    Delete
                  </button>
                </Dialog.Title>
                <Dialog.Title as="h3" className={styles.option}>
                  <button onClick={() => setOpen(false)}>Cancel</button>
                </Dialog.Title>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
