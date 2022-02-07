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
          className="flex flex-col items-center justify-center px-4"
          key={file.name}
        >
          <h2 className="text-xl sm:text-2xl mb-1 font-light">
            You can only upload 1 image
          </h2>

          <h3 className="text-xs sm:text-s text-gray-500 text-center mb-5">
            Support for multiple images is coming soon
          </h3>
        </div>
      );
    }

    return (
      <div
        className="flex flex-col items-center justify-center px-4"
        key={file.name}
      >
        <h2 className="text-xl sm:text-2xl mb-1 font-light">
          {errors[0].code}
        </h2>
        <div className="text-xs sm:text-s text-gray-500 text-center mb-5">
          <h3 className="font-semibold float-left mr-1">{file.name}</h3>
          {errors[0].message}
        </div>
      </div>
    );
  });

  return <>{errorMessages[0]}</>;
}
