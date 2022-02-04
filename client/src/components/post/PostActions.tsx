import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function PostActions({ open, setOpen }: Props) {
  const styles = {
    option: "text-m text-center text-gray-900 py-3",
  };

  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);

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
                <Dialog.Title
                  as="h3"
                  className={`${styles.option} font-bold text-red-600`}
                >
                  Delete
                </Dialog.Title>
                <Dialog.Title as="h3" className={styles.option}>
                  <CopyToClipboard
                    text={window.location.href}
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
