import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { LeftArrowIcon } from "../Icons";
import { Area } from "react-easy-crop/types";
import { MAX_CAPTION_LENGTH } from "../../utis/constants";
import { useCreatePostMutation } from "../../graphql/generated/graphql";
import router from "next/router";
import ImageUploader from "./ImageUploader";
import ImageCropper from "./ImageCropper";

export interface ImageFile extends File {
  preview?: string;
}

function CreatePostForm() {
  const [, createPost] = useCreatePostMutation();

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<
    Area | undefined
  >();
  // storing the previous crop in case the user wants to ammend it

  const styles = {
    form: "aspect-square transition-all duration-500 ease-in-out w-[350px] sm:w-3/5 xl:w-[900px] rounded-xl mx-auto shadow-lg p-0 border-2 border-gray-50",
    header:
      "flex justify-between items-center text-md py-2 px-4 font-semibold text-gray-900 border-b-2 border-gray-300",
  };

  return (
    <div className={styles.form}>
      {loading ? (
        <>
          <section className={styles.header}>
            <div />
            <h1>Loading</h1>
            <div />
          </section>
          <div className="flex w-full h-full items-center justify-center">
            Loading...
          </div>
        </> // to be improved
      ) : files.length === 0 ? (
        // no image is selected (stage 1)
        <ImageUploader setFiles={setFiles} styles={styles} />
      ) : !croppedImage ? (
        // image selected, cropping the image (stage 2)
        <ImageCropper
          files={files}
          setFiles={setFiles}
          styles={styles}
          setCroppedImage={setCroppedImage}
          croppedAreaPixels={croppedAreaPixels}
          setCroppedAreaPixels={setCroppedAreaPixels}
        />
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
              <section className={styles.header}>
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
                  className="p-2 w-full h-full resize-none outline-none"
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
