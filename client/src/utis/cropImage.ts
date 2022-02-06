import { Area } from "react-easy-crop/types";

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */

// removed rotation as not required for this use case

export const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export async function getCroppedImg(imageSrc: string, pixelCrop: Area) {
  const image = (await createImage(imageSrc)) as any;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // set canvas size to match image
  canvas.width = image.width;
  canvas.height = image.height;

  // draw image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // place image in the top left corner
  ctx.putImageData(data, 0, 0);

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!));
    }, "image/jpeg");
  });
}

export async function getFilteredImg(imageSrc: string, filters: string) {
  const image = (await createImage(imageSrc)) as any;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // set canvas size to match image
  canvas.width = image.width;
  canvas.height = image.height;

  // apply filters
  ctx.filter = filters;

  // draw image
  ctx.drawImage(image, 0, 0);

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!));
    }, "image/jpeg");
  });
}
