import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import getCroppedImg from "../../utis/cropImage";
import { XIcon } from "../Icons";
import { ImageFile } from "./CreatePostForm";

type Props = {
  files: ImageFile[];
  setFiles: (files: ImageFile[]) => void;
  setCroppedImage: (croppedImage: string | null) => void;
  styles: {
    header: string;
  };
  croppedAreaPixels?: Area;
  setCroppedAreaPixels: (croppedAreaPixels: Area | undefined) => void;
};

export default function ImageCropper({
  files,
  setFiles,
  styles,
  setCroppedImage,
  croppedAreaPixels,
  setCroppedAreaPixels,
}: Props) {
  interface ImageDimensions {
    width: number;
    height: number;
  }

  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>();
  const [cropFit, setCropFit] = useState<
    "contain" | "horizontal-cover" | "vertical-cover" | undefined
  >();

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [loading, setLoading] = useState(false);

  const clearFiles = () => {
    // prevent memory leak
    URL.revokeObjectURL(files[0].preview as string);
    setFiles([]);
  };

  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = files[0].preview as string;

    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
    };
  }, []);

  useEffect(() => {
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

  return loading ? (
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
  ) : (
    <>
      <section className={styles.header}>
        <div className="w-10" />
        <h2>Crop your image</h2>
        <button
          className="font-semibold text-indigo-700 w-10"
          onClick={showCroppedImage}
          // progresses to next stage in form
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
            initialCroppedAreaPixels={croppedAreaPixels}
          />
          <div className="absolute pointer-events-none inset-4 flex justify-end items-end z-10">
            <button className="bg-black rounded-full p-2" onClick={clearFiles}>
              <XIcon className="stroke-white h-5 stroke-2 pointer-events-auto" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
