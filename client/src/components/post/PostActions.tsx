import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";
import {
  PostQuery,
  useDeletePostMutation,
  FeedPostFragment,
  CurrentUserQuery,
} from "../../graphql/generated/graphql";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  post: PostQuery["post"] | FeedPostFragment;
  user: CurrentUserQuery["currentUser"];
};

export default function PostActions({ open, setOpen, post, user }: Props) {
  const [, deletePost] = useDeletePostMutation();

  const styles = {
    option: "text-m text-center text-gray-900 py-4",
  };

  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (copied) {
      setDone(true);
      setTimeout(() => {
        setCopied(false);
        setDone(false);
        // stops the main modal menu from showing briefly
      }, 2000);
    }
  }, [copied]);

  return copied ? (
    <Transition.Root show={copied} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0" onClose={setCopied}>
        <div className="flex items-end min-h-screen text-center ">
          <Transition.Child as={Fragment}>
            <Dialog.Overlay className="fixed inset-0 bg-none" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-in duration-200"
            enterFrom="translate-y-4 "
            enterTo="translate-y-0 sm:scale-100"
            leave="ease-out duration-200"
            leaveFrom="translate-y-4 sm:scale-100"
            leaveTo="translate-y-0"
          >
            <div className="inline-block w-full bg-modal text-left shadow-xl transform transition-all ">
              <Dialog.Title as="h3" className="text-white p-4">
                Link copied to clipboard
              </Dialog.Title>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  ) : confirmDelete ? (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0"
        onClose={setConfirmDelete}
      >
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
                <div className="p-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-center text-gray-900 p-1"
                  >
                    Delete post?
                  </Dialog.Title>
                  <h3 className="text-sm text-center text-gray-500">
                    Are you sure you want to delete this post?
                  </h3>
                </div>

                <div className={styles.option}>
                  <button
                    className="font-bold text-red-600"
                    onClick={async () => {
                      const response = await deletePost({ id: post!.id });
                      if (response.data && !response.data.deletePost.errors) {
                        router.replace("/");
                      }
                      // need to handle this and display an error message
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className={styles.option}>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setConfirmDelete(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  ) : !done ? (
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
                {post?.author.id === user?.id && (
                  <Dialog.Title as="h3" className={styles.option}>
                    <button
                      className="font-bold text-red-600"
                      onClick={() => {
                        setConfirmDelete(true);
                      }}
                    >
                      Delete
                    </button>
                  </Dialog.Title>
                )}
                <Dialog.Title as="h3" className={styles.option}>
                  <CopyToClipboard
                    // fix this
                    text={`http://localhost:3000/p/${post!.id}`}
                    onCopy={() => {
                      setOpen(false);
                      setCopied(true);
                    }}
                  >
                    <button>Copy link</button>
                  </CopyToClipboard>
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
  ) : null;
}
