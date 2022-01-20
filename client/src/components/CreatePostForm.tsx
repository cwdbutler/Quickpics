import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fileValidator } from "../utis/fileValidator";

function CreatePostForm() {
  interface imageFile extends File {
    preview?: string;
  }
  const [files, setFiles] = useState<imageFile[]>([]);
  const [dropzoneStyle, setdropzoneStyle] = useState<string>();
  const [title, setTitle] = useState<string>();

  const { getRootProps, getInputProps, fileRejections, open, isDragActive } =
    useDropzone({
      validator: fileValidator,
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) => {
            return Object.assign(file, {
              preview: URL.createObjectURL(file),
              // creates an image blob assigned to the file object
            });
          })
        );
      },
      noClick: true,
    });

  // change colour if file is being dragged over the div
  useEffect(() => {
    isDragActive
      ? setdropzoneStyle(
          "bg-slate-100 h-full w-full flex flex-col items-center justify-center pb-12"
        )
      : setdropzoneStyle(
          "h-full w-full flex flex-col items-center justify-center pb-12"
        );
  }, [isDragActive]);

  const fileErrors = fileRejections.map(({ file, errors }) => {
    // couldn't figure out how else to do this
    if (errors[0].code == "too-many-files") {
      return (
        <div
          className="flex flex-col items-center justify-center"
          key={file.name}
        >
          <h2 className="text-2xl">You can only upload 1 image</h2>

          <h3 className="mb-4">Support for multiple images is coming soon</h3>
        </div>
      );
    }

    return (
      <div
        className="flex flex-col items-center justify-center"
        key={file.name}
      >
        <h2 className="text-2xl">{errors[0].code}</h2>
        <div className="flex">
          <h3 className="font-semibold mr-1">{file.name}</h3>
          <h3 className="mb-4">{errors[0].message}</h3>
        </div>
      </div>
    );
  });

  // change the title to reflect progression through the form
  useEffect(() => {
    if (fileErrors.length > 0) {
      setTitle("Couldn't upload files");
    } else {
      setTitle("Create a post");
    }
  }, [files, fileErrors]);

  return (
    <div className="aspect-square transition-all duration-500 ease-in-out w-[350px] sm:w-3/5 xl:w-[900px] rounded-xl mx-auto shadow-lg p-0 border-2 border-gray-50">
      <h1 className="text-lg text-center p-2 font-semibold text-gray-900 border-b-2 border-gray-300">
        {title}
      </h1>

      <div className="h-full flex flex-col items-center justify-center">
        {fileErrors.length > 0 ? (
          // file errors
          <div {...getRootProps()} className={dropzoneStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-28 w-28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {fileErrors[0]}
            <input {...getInputProps()} />
            <button
              onClick={open}
              className="text-white bg-indigo-700 flex px-3 py-2 rounded-md text-sm font-medium shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload another file
            </button>
          </div>
        ) : files.length > 0 ? (
          // a valid image is selected
          <div className="w-full h-full flex justify-center items-center relative p-0 z-0">
            <img
              src={files[0].preview}
              className="w-full h-full object-cover rounded-b-md"
            />
            <div className="absolute inset-6 flex justify-end items-end z-10">
              <button
                className="bg-black rounded-full p-2"
                onClick={() => setFiles([])}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // no image is selected
          <div {...getRootProps()} className={dropzoneStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-28 w-28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mb-4 text-2xl">Drag a photo here</p>
            <input {...getInputProps()} />
            <button
              onClick={open}
              className="text-white bg-indigo-700 flex px-3 py-2 rounded-md text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Click to upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePostForm;
