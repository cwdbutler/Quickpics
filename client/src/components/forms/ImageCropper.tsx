import { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import getCroppedImg from "../../utis/cropImage";
import { LeftArrowIcon, XIcon, ZoomIcon } from "../Icons";
import { ImageFile } from "./CreatePostForm";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

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

  const [zoomOpen, setZoomOpen] = useState(false);

  const zoomRef = useRef(null);

  return loading ? (
    <>
      <section className={styles.header}>
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
        <button type="button" onClick={() => setFiles([])}>
          <LeftArrowIcon className="h-6 stroke-2" />
        </button>
        <h2>Crop</h2>
        <button
          className="font-semibold text-blue w-10"
          onClick={showCroppedImage}
          // progresses to next stage in form
        >
          Next
        </button>
      </section>

      <div
        onMouseDown={() => {
          if (zoomOpen) {
            setZoomOpen(false);
          }
        }}
        className="h-full w-full p-0 flex flex-col items-center justify-center"
      >
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
            zoomWithScroll={false}
          />
          <div className="absolute pointer-events-none inset-4 flex justify-start items-end z-10">
            <button
              type="button"
              onClick={() => setZoomOpen(!zoomOpen)}
              className="bg-black bg-opacity-50 rounded-full p-2 pointer-events-auto"
            >
              <ZoomIcon className="stroke-white h-5 stroke-2" />
            </button>
            <div
              ref={zoomRef}
              className={`${
                zoomOpen ? "visible" : "invisible"
              } absolute bottom-12 bg-opacity-50 bg-black flex items-center py-2 px-4 rounded-m pointer-events-auto`}
            >
              <Slider
                onChange={(value) => setZoom(value)}
                min={1}
                max={3}
                step={0.1}
                aria-label="zoom"
                w={24}
                focusThumbOnChange={false}
              >
                <SliderTrack bg="black" h={0.5}>
                  <SliderFilledTrack bg="white" />
                </SliderTrack>
                <SliderThumb boxSize={4} />
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
