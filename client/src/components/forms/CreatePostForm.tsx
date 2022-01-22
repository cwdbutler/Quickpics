import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fileValidator } from "../../utis/fileValidator";
import { ExclamationIcon, ImageIcon, UploadIcon, XIcon } from "../Icons";
import FileErrors from "./FileErrors";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

function CreatePostForm() {
  interface ImageFile extends File {
    preview?: string;
  }

  interface ImageDimensions {
    width: number;
    height: number;
  }

  const [files, setFiles] = useState<ImageFile[]>([]);
  const [dropzoneStyle, setdropzoneStyle] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>();
  const [cropFit, setCropFit] = useState<
    "contain" | "horizontal-cover" | "vertical-cover" | undefined
  >();
  const [loading, setLoading] = useState(false);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {},
    []
  );

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
    } else if (files.length > 0) {
      setTitle("Crop your image");
    } else {
      setTitle("Create a post");
    }
  }, [files, fileRejections]);

  useEffect(() => {
    if (files.length > 0) {
      const img = new Image();
      img.src = files[0].preview as string;

      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        });
      };
      console.log("setting image dimensions:", imageDimensions);
    } else {
      setImageDimensions(null);
    }
  }, [files]);

  useEffect(() => {
    setLoading(true);
    console.log("setting crop fit", imageDimensions);
    if (imageDimensions?.height && imageDimensions.width) {
      if (imageDimensions.height > imageDimensions.width) {
        setCropFit("horizontal-cover");
        console.log("setting to horizontal", cropFit);
        setLoading(false);
      } else if (imageDimensions.height < imageDimensions.width) {
        setCropFit("vertical-cover");
        console.log("setting to vertical", cropFit);
        setLoading(false);
      }
    }
  }, [imageDimensions]);

  const clearFiles = () => {
    // prevent memory leak
    URL.revokeObjectURL(files[0].preview as string);
    setFiles([]);
  };

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
        ) : !loading ? (
          // image selected, cropping the image (stage 2)
          <div className="w-full h-full relative p-0 z-0">
            <Cropper
              image={files[0].preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit={cropFit}
              classes={{
                containerClassName: "rounded-b-md",
                cropAreaClassName: "cursor-grab active:cursor-grabbing",
              }}
            />
            <div className="absolute pointer-events-none inset-4 flex justify-end items-end z-10">
              <button
                className="bg-black rounded-full p-2"
                onClick={clearFiles}
              >
                <XIcon className="stroke-white  h-5 stroke-2 pointer-events-auto" />
              </button>
            </div>
          </div>
        ) : (
          // waiting for the image dimensions to set the image size within the crop container
          <div />
        )}
      </div>
    </div>
  );
}

export default CreatePostForm;
