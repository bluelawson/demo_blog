import React from "react";

type ImageUploadProps = {
  imageUrl: string;
  inputRef?: React.LegacyRef<HTMLInputElement>;
  handleClose: () => void;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageUpload({
  imageUrl,
  inputRef,
  handleClose,
  handleUpload,
}: ImageUploadProps) {
  return (
    <>
      {imageUrl && (
        <div className="relative inline-block mt-4">
          <img
            src={imageUrl}
            alt={"no image"}
            className="object-cover w-full h-48 mb-4 rounded"
          />
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 w-5 text-lg text-white bg-black rounded"
          >
            ×
          </button>
        </div>
      )}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          ref={inputRef}
        />
      </div>
    </>
  );
}
