import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { fileValidator } from "../../utis/fileValidator";
import { ExclamationIcon, ImageIcon, UploadIcon, XIcon } from "../Icons";
import FileErrors from "./FileErrors";

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
      noKeyboard: true,
    });
  // users cannot click the dropzone or focus it with tab, they can only click the upload button and keyboard navigate to it

  // change colour if file is being dragged over the dropzone
  useEffect(() => {
    isDragActive
      ? setdropzoneStyle(
          "bg-slate-100 h-full w-full flex flex-col items-center justify-center pb-12"
        )
      : setdropzoneStyle(
          "h-full w-full flex flex-col items-center justify-center pb-12"
        );
  }, [isDragActive]);

  // change the title to reflect progression through the form
  useEffect(() => {
    if (fileRejections.length > 0) {
      setTitle("Couldn't upload files");
    } else {
      setTitle("Create a post");
    }
  }, [files, fileRejections]);

  return (
    <div className="aspect-square transition-all duration-500 ease-in-out w-[350px] sm:w-3/5 xl:w-[900px] rounded-xl mx-auto shadow-lg p-0 border-2 border-gray-50">
      <h1 className="text-lg text-center p-2 font-semibold text-gray-900 border-b-2 border-gray-300">
        {title}
      </h1>

      <div className="h-full flex flex-col items-center justify-center">
        {files.length === 0 && fileRejections.length === 0 ? (
          // no image is selected (stage 1)
          <div {...getRootProps()} className={dropzoneStyle}>
            <ImageIcon className="h-28 stroke-0.5" />
            <p className="mb-4 text-2xl">Drag a photo here</p>
            <input {...getInputProps()} />
            <button
              onClick={open}
              className="text-white bg-indigo-700 flex px-3 py-2 rounded-md text-sm font-medium"
            >
              <UploadIcon className="h-5 mr-2 stroke-2" />
              Click to upload
            </button>
          </div>
        ) : fileRejections.length > 0 ? (
          // file errors
          <div {...getRootProps()} className={dropzoneStyle}>
            <ExclamationIcon className="h-28 stroke-0.5" />
            <FileErrors fileRejections={fileRejections} />
            <input {...getInputProps()} />
            <button
              onClick={open}
              className="text-white bg-indigo-700 flex px-3 py-2 rounded-md text-sm font-medium"
            >
              <UploadIcon className="h-5 mr-2 stroke-2" />
              Upload another file
            </button>
          </div>
        ) : (
          // a valid image is selected (stage 2)
          <div className="w-full h-full flex justify-center items-center relative p-0 z-0">
            <img
              src={files[0].preview}
              className="w-full h-full object-cover rounded-b-md"
            />
            <div className="absolute inset-4 flex justify-end items-end z-10">
              <button
                className="bg-black rounded-full p-2"
                onClick={() => setFiles([])}
              >
                <XIcon className="stroke-white h-5 stroke-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePostForm;
