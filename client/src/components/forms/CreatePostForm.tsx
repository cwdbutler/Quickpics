import { Formik, Form, Field } from "formik";
import { useRef, useState } from "react";
import { HappyIcon, LeftArrowIcon } from "../Icons";
import { Area } from "react-easy-crop/types";
import { MAX_TEXT_LENGTH } from "../../utis/constants";
import { useCreatePostMutation } from "../../graphql/generated/graphql";
import { useRouter } from "next/router";
import ImageUploader from "./ImageUploader";
import ImageCropper from "./ImageCropper";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useDetectClickOutside } from "react-detect-click-outside";
import ImageEditor from "./ImageEditor";
import { Filter, filterConfig } from "../../utis/filterConfig";
import Spinner from "../Spinner";

export interface ImageFile extends File {
  preview?: string;
}

function CreatePostForm() {
  const [, createPost] = useCreatePostMutation();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<
    Area | undefined
  >();
  // storing the previous crop in case the user wants to ammend it

  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filter[]>(filterConfig);

  const styles = {
    form: "aspect-square bg-white transition-all duration-500 ease-in-out w-[350px] sm:w-3/5 md:w-[550px] 3xl:w-[900px] rounded-xl mx-auto border-[1px] p-0 border-gray-300",
    header:
      "flex justify-between items-center text-md py-2 px-4 font-semibold text-gray-900 border-b-[1px] border-gray-300",
  };

  const [showEmojiMenu, setShowEmojimenu] = useState(false);

  const emojiRef = useDetectClickOutside({
    onTriggered: () => setShowEmojimenu(false),
  });

  const inputRef = useRef<any>();

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
            <Spinner />
          </div>
        </>
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
      ) : !filteredImage ? (
        <ImageEditor
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
          styles={styles}
          setFilteredImage={setFilteredImage}
          filters={filters}
          setFilters={setFilters}
        />
      ) : (
        // image cropped, adding caption (stage 3)
        <Formik
          initialValues={{
            caption: "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
            const res: Response = await fetch(filteredImage);
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
          {({ values, setFieldValue }) => (
            <Form>
              <section className={styles.header}>
                <div className="w-14">
                  <button
                    onClick={() => {
                      setFilteredImage(null);
                    }}
                    className="flex justify-center"
                  >
                    <LeftArrowIcon className="h-6 stroke-2" />
                  </button>
                </div>
                <h2>Create new post</h2>
                <button type="submit" className="font-semibold text-blue">
                  Share
                </button>
              </section>

              <div className="h-full flex flex-col items-center justify-center">
                <img
                  src={filteredImage}
                  draggable={false}
                  className="h-full w-full"
                />
              </div>
              <section className="h-64 w-full p-2 flex flex-col justify-center">
                <Field
                  innerRef={(el: any) => (inputRef.current = el)}
                  as="textarea"
                  className="p-2 w-full h-full resize-none outline-none"
                  id="caption"
                  name="caption"
                  placeholder="Add a caption..."
                  value={
                    values.caption.length >= MAX_TEXT_LENGTH
                      ? values.caption.substring(0, MAX_TEXT_LENGTH - 1)
                      : values.caption
                  }
                  // prevent typing if max lengh reached
                />
                <footer
                  aria-label="character count"
                  className="flex w-full items-center justify-between text-xs text-gray-400 h-8 px-1 pt-2 mb-1"
                >
                  <div className="flex" ref={emojiRef}>
                    <div className="relative">
                      {showEmojiMenu && (
                        <div>
                          <Picker
                            style={{
                              position: "absolute",
                              bottom: "257px",
                            }}
                            onSelect={(emoji: any) => {
                              if (emoji.native) {
                                setFieldValue(
                                  "caption",
                                  values.caption + emoji.native
                                );
                                setShowEmojimenu(false);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmojimenu(!showEmojiMenu);
                        inputRef.current.focus();
                      }}
                    >
                      <HappyIcon className="h-7" />
                    </button>
                  </div>

                  <span aria-label="caption length">
                    {values.caption.length}/2200
                  </span>
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
