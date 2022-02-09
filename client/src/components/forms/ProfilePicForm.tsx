import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useRef, useState } from "react";
import {
  useRemoveProfilePicMutation,
  UserInfoFragment,
  useUpdateProfilePicMutation,
} from "../../graphql/generated/graphql";
import { fileValidator } from "../../utis/fileValidator";

type Props = {
  user: UserInfoFragment | undefined | null;
};

export default function ProfilePicForm({ user }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);

  const [, upateProfilePic] = useUpdateProfilePicMutation();
  const [, removeProfilePic] = useRemoveProfilePicMutation();

  const handeClick = () => {
    if (!user?.avatarUrl) {
      // if no pic, just open the input
      inputRef.current?.click();
    } else {
      setOpen(true);
    }
  };

  const handleUpload = async (file: File) => {
    const response = await upateProfilePic({
      file: file,
    });
    if (response.error) {
      setError("Something went wrong, please try again");
    }
  };

  const styles = {
    option: "text-m text-center text-gray-900 py-4",
  };

  return (
    <>
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
                  <div className="p-6">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-center text-gray-900 p-1"
                    >
                      Change profile photo
                    </Dialog.Title>
                  </div>
                  <div className={styles.option}>
                    <button
                      className="font-bold text-blue"
                      onClick={async () => {
                        inputRef.current?.click();
                      }}
                    >
                      Upload Photo
                    </button>
                  </div>
                  <div className={styles.option}>
                    <button
                      className="font-bold text-red-600"
                      onClick={async () => {
                        await removeProfilePic();
                        setOpen(false);
                      }}
                    >
                      Remove current photo
                    </button>
                  </div>
                  <div className={styles.option}>
                    <button
                      onClick={() => {
                        setOpen(false);
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
      <input
        ref={inputRef}
        type="file"
        name="image"
        id="image"
        className="hidden"
        accept="image/*"
        onChange={(event) => {
          if (event.target.files) {
            let errorMsg: string | null;
            if (event.target.files.length > 1) {
              errorMsg = "Please only upload 1 file";
            } else {
              errorMsg = fileValidator(event.target.files[0])?.code || null;
            }
            if (!errorMsg) {
              handleUpload(event.target.files[0]);
              setOpen(false);
            } else {
              setError(errorMsg);
            }
          }
        }}
      />
      <Image
        objectFit="cover"
        aria-label="Profile picture upload"
        onClick={handeClick}
        width={150}
        height={150}
        priority
        src={user?.avatarUrl ? user.avatarUrl : "/default.jpg"}
        className="rounded-full hover:cursor-pointer"
      />
      <h3 className="absolute text-center w-64 text-red-500 -bottom-8">
        {error}
      </h3>
    </>
  );
}
