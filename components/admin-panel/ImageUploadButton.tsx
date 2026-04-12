"use client";

import React, { useRef, useState } from "react";
import { uploadImageFile } from "../../services/cloudinary";

type ImageUploadButtonProps = {
  folder?: string;
  label?: string;
  className?: string;
  onUploaded: (url: string) => void;
};

export default function ImageUploadButton({
  folder,
  label = "Tải ảnh",
  className = "",
  onUploaded,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImageFile(file, { folder });
      onUploaded(result.url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Tải ảnh thất bại.";
      alert(message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className={className}
      >
        <i
          className={`fa-solid ${
            isUploading ? "fa-spinner animate-spin" : "fa-cloud-arrow-up"
          }`}
        ></i>
        <span>{isUploading ? "Đang tải..." : label}</span>
      </button>
    </>
  );
}
