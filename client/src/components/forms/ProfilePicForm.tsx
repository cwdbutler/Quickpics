import Image from "next/image";
import React, { useRef, useState } from "react";
import {
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

  const [, upateProfilePic] = useUpdateProfilePicMutation();

  const handleUpload = async (file: File) => {
    const response = await upateProfilePic({
      file: file,
    });
  };

  return (
    <div className="mx-20 select-none flex flex-col items-center relative">
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
            } else {
              setError(errorMsg);
            }
          }
        }}
      />
      <Image
        objectFit="cover"
        aria-label="Profile picture upload"
        onClick={() => inputRef.current?.click()}
        width={150}
        height={150}
        priority
        src={
          user?.avatarUrl
            ? user.avatarUrl
            : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
        }
        className="rounded-full hover:cursor-pointer"
      />
      <h3 className="absolute text-center w-64 text-red-500 -bottom-8">
        {error}
      </h3>
    </div>
  );
}
