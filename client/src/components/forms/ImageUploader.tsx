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

  const buttonStyle =
    "text-white bg-blue flex px-3 py-1 rounded-m text-sm font-medium";

  return fileRejections.length === 0 ? (
    // no image is selected (stage 1)
    <>
      <section className={styles.header}>
        <div />
        <h1>Create new post</h1>
        <div />
      </section>

      <div className="h-full flex flex-col items-center justify-center">
        <div
          {...getRootProps()}
          className={`${
            isDragActive ? "bg-gray-100" : ""
          } h-full w-full flex flex-col items-center justify-center pb-12`}
        >
          <ImageIcon className="h-24 stroke-0.5" />
          <p className="mb-5 text-2xl font-light">Drag a photo here</p>
          <input {...getInputProps()} />
          <button onClick={open} className={buttonStyle}>
            Select From Computer
          </button>
        </div>
      </div>
    </>
  ) : (
    // file errors
    <>
      <section className={styles.header}>
        <div />
        <h1>File couldn't be uploaded</h1>
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
          <button onClick={open} className={buttonStyle}>
            Select Another File
          </button>
        </div>
      </div>
    </>
  );
}
