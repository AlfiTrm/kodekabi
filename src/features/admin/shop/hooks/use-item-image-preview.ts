"use client";

import { useEffect, useState, type ChangeEvent } from "react";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 5 * 1024 * 1024;

export function useItemImagePreview(initialUrl = "") {
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!acceptedTypes.has(file.type)) {
      event.target.value = "";
      setError("Gunakan gambar PNG, JPG, atau WEBP.");
      return;
    }
    if (file.size > maxSize) {
      event.target.value = "";
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setError("");
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return { previewUrl, fileName, error, handleImageChange };
}
