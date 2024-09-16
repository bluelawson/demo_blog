"use client";
import React, { useState, useRef } from "react";

type ImageUploaderProps = {
  fetchImageUrl?: string;
  onUploadComplete?: (file: File | null) => void;
};

export default function ImageUploader({
  fetchImageUrl,
  onUploadComplete,
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(fetchImageUrl ?? "");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileName = file.name;

      const hasJapanese = /[^\x00-\x7F]/.test(fileName);

      if (hasJapanese) {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setError(
          "ファイル名に日本語が含まれています。別の名前を使用してください。"
        );
        setImageUrl("");
        return;
      }

      setError("");
      setImageUrl(URL.createObjectURL(file));

      if (onUploadComplete) {
        onUploadComplete(file);
      }
    }
  };

  const handleClose = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setImageUrl("");
    setError("");

    if (onUploadComplete) {
      onUploadComplete(null);
    }
  };

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {imageUrl && (
        <div className="relative inline-block mt-4">
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 w-5 text-lg text-white bg-black rounded"
          >
            ×
          </button>
          <img
            src={imageUrl}
            alt="uploaded"
            className="max-w-xs border rounded-lg"
          />
        </div>
      )}
      <div className="mt-2">
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
