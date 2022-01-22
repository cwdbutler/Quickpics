import { FileError } from "react-dropzone";
import { MAX_FILE_SIZE, MIN_FILE_SIZE } from "./constants";

// returns objects compatible with react-dropzone error type
export const fileValidator = (file: File): FileError | null => {
  if (
    !(file.type.startsWith("image/png") || file.type.startsWith("image/jpeg"))
  ) {
    return {
      code: "Please upload an image file",
      message: `could not be uploaded`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      code: "Files must be 5MB or less",
      message: `is too large`,
    };
  }

  if (file.size < MIN_FILE_SIZE) {
    return {
      code: "Files must be 5KB or more",
      message: `is too small`,
    };
  }

  return null;
};
