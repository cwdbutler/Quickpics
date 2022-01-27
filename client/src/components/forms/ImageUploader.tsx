import { useDropzone } from "react-dropzone";
import { fileValidator } from "../../utis/fileValidator";
import { ImageIcon, UploadIcon, ExclamationIcon } from "../Icons";
import { ImageFile } from "./CreatePostForm";
import FileErrors from "./FileErrors";

type Props = {
  setFiles: (files: ImageFile[]) => void;
  styles: {
    header: string;
  };
};

export default function ImageUploader({ setFiles, styles }: Props) {
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

  return fileRejections.length === 0 ? (
    // no image is selected (stage 1)
    <>
      <section className={styles.header}>
        <div />
        <h1>Create a post</h1>
        <div />
      </section>

      <div className="h-full flex flex-col items-center justify-center">
        <div
          {...getRootProps()}
          className={`${
            isDragActive ? "bg-gray-100" : ""
          } h-full w-full flex flex-col items-center justify-center pb-12`}
        >
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
      </div>
    </>
  ) : (
    // file errors
    <>
      <section className={styles.header}>
        <div />
        <h1>Couldn't upload files</h1>
        <div />
      </section>

      <div className="h-full flex flex-col items-center justify-center">
        <div
          {...getRootProps()}
          className={`${
            isDragActive ? "bg-gray-100" : ""
          } h-full w-full flex flex-col items-center justify-center pb-12`}
        >
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
      </div>
    </>
  );
}
