"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

const maxImageSize = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png"]);

export function useEvidenceImageUpload(disabled: boolean) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  function validateFile(file?: File) {
    if (!file) return false;
    if (!acceptedImageTypes.has(file.type)) {
      setError("Gunakan file PNG atau JPG.");
      return false;
    }
    if (file.size > maxImageSize) {
      setError("Ukuran file maksimal 5MB.");
      return false;
    }
    setError("");
    setFileName(file.name);
    return true;
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    validateFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (disabled) return;
    const file = event.dataTransfer.files[0];
    if (!validateFile(file)) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (inputRef.current) inputRef.current.files = transfer.files;
  }

  return { inputRef, fileName, error, handleChange, handleDrop };
}
