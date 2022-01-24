import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fileValidator } from "../../utis/fileValidator";
import {
  ExclamationIcon,
  ImageIcon,
  LeftArrowIcon,
  UploadIcon,
  XIcon,
} from "../Icons";
import FileErrors from "./FileErrors";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import getCroppedImg from "../../utis/cropImage";
import { mapToFormErrors } from "../../utis/mapToFormErrors";
import { MAX_CAPTION_LENGTH } from "../../utis/constants";
import { useCreatePostMutation } from "../../graphql/generated/graphql";
import router from "next/router";

function CreatePostForm() {
  interface ImageFile extends File {
    preview?: string;
  }

  interface ImageDimensions {
    width: number;
    height: number;
  }

  const [, createPost] = useCreatePostMutation();

  const [files, setFiles] = useState<ImageFile[]>([]);
  const [dropzoneStyle, setdropzoneStyle] = useState<string>();
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>();
  const [cropFit, setCropFit] = useState<
    "contain" | "horizontal-cover" | "vertical-cover" | undefined
  >();
  const [loading, setLoading] = useState(false);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

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
    } else {
      setImageDimensions(null);
    }
  }, [files]);

  useEffect(() => {
    setLoading(true);
    /* sets the react-easy-crop objectFit option
    the image will fill the container in one axis and then overflow in the other */
    if (imageDimensions?.height && imageDimensions.width) {
      if (imageDimensions.height >= imageDimensions.width) {
        setCropFit("horizontal-cover");
        setLoading(false);
      } else if (imageDimensions.height < imageDimensions.width) {
        setCropFit("vertical-cover");
        setLoading(false);
      }
    }
  }, [imageDimensions]);

  const clearFiles = () => {
    // prevent memory leak
    URL.revokeObjectURL(files[0].preview as string);
    setFiles([]);
  };

  const styles = {
    form: "aspect-square transition-all duration-500 ease-in-out w-[350px] sm:w-3/5 xl:w-[900px] rounded-xl mx-auto shadow-lg p-0 border-2 border-gray-50",
    header:
      "flex justify-center items-center text-md py-2 px-4 font-semibold text-gray-900 border-b-2 border-gray-300",
    headerWithButtons:
      "flex justify-between items-center text-md py-2 px-4 font-semibold text-gray-900 border-b-2 border-gray-300",
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        files[0].preview!,
        croppedAreaPixels!
      );
      setCroppedImage(croppedImage as string);
    } catch (err) {
      console.error(err);
    }
  }, [croppedAreaPixels]);

  return (
    <div className={styles.form}>
      {files.length === 0 && fileRejections.length === 0 ? (
        // no image is selected (stage 1)
        <>
          <section className={styles.header}>
            <h1>Create a post</h1>
          </section>

          <div className="h-full flex spacebet flex-col items-center justify-center">
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
          </div>
        </>
      ) : fileRejections.length > 0 ? (
        // file errors
        <>
          <section className={styles.header}>
            <h1>Couldn't upload files</h1>
          </section>

          <div className="h-full flex flex-col items-center justify-center">
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
          </div>
        </>
      ) : loading ? (
        <>
          <section className={styles.header}>
            <h1>Loading</h1>
          </section>
          <div className="flex w-full h-full items-center justify-center">
            Loading...
          </div>
        </> // to be improved
      ) : !croppedImage ? (
        // image selected, cropping the image (stage 2)
        <>
          <section className={styles.headerWithButtons}>
            <div className="w-10" />
            <h2>Crop your image</h2>
            <button
              className="font-semibold text-indigo-700 w-10"
              onClick={showCroppedImage}
            >
              Next
            </button>
          </section>

          <div className="h-full flex flex-col items-center justify-center">
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
                  <XIcon className="stroke-white h-5 stroke-2 pointer-events-auto" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // image cropped, adding caption (stage 3)
        <Formik
          initialValues={{
            caption: "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
            const res: Response = await fetch(croppedImage);
            const blob: Blob = await res.blob();
            const imageFile = new File(
              [blob],
              `${files[0].name}-cropped.jpg`,
              // this gets changed in the backend anyway
              {
                type: "image/png",
              }
            );
            const response = await createPost({
              caption: values.caption,
              file: imageFile,
            });
            setLoading(false);
            if (response.error) {
              // do something
            } else if (response.data?.createPost) {
              router.push("/");
            }
          }}
        >
          {({ values }) => (
            <Form>
              <section className={styles.headerWithButtons}>
                <div className="w-14">
                  <button
                    onClick={() => {
                      setCroppedImage(null);
                    }}
                  >
                    <LeftArrowIcon className="h-6 stroke-2" />
                  </button>
                </div>
                <h2>Add a caption</h2>
                <button type="submit" className="font-semibold text-indigo-700">
                  Share
                </button>
              </section>

              <div className="h-full flex flex-col items-center justify-center">
                <img src={croppedImage} className="h-full w-full" />
              </div>
              <section className="h-64 w-full p-2 flex flex-col justify-center">
                <Field
                  as="textarea"
                  className="p-2 w-full h-full resize-none focus:outline-none"
                  id="caption"
                  name="caption"
                  placeholder="Caption"
                  value={
                    values.caption.length >= MAX_CAPTION_LENGTH
                      ? values.caption.substring(0, MAX_CAPTION_LENGTH - 1)
                      : values.caption
                  }
                  // prevent typing if max lengh reached
                />
                <footer
                  aria-label="character count"
                  className="text-xs text-gray-400 h-8 p-2"
                >
                  {values.caption.length}/2200
                </footer>
              </section>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default CreatePostForm;
