import { useRef, useState, useEffect } from "react";

export default function test() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(undefined);
    }
  }, [image]);

  return (
    <div>
      <form>
        <div className="aspect-square rounded-full w-60 object-contain">
          <img
            src={preview}
            onClick={() => {
              setImage(undefined);
            }}
          />
        </div>
        <button
          onClick={(event) => {
            event.preventDefault();
            imageInputRef.current?.click();
          }}
        >
          Add Image
        </button>
        <input
          type="file"
          className="hidden"
          ref={imageInputRef}
          accept="image/*"
          onChange={(event) => {
            if (!event.target.files) {
              return;
            }
            const file = event.target.files[0];
            if (file && file.type.startsWith("image")) {
              setImage(file);
            } else {
              setImage(undefined);
            }
          }}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            setImage(undefined);
          }}
        >
          Clear image
        </button>
      </form>
    </div>
  );
}
