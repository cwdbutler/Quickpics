import { FileRejection } from "react-dropzone";

interface FileErrorProps {
  fileRejections: FileRejection[];
}

export default function FileErrors({ fileRejections }: FileErrorProps) {
  const errorMessages = fileRejections.map(({ file, errors }) => {
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

  return <>{errorMessages[0]}</>;
}
