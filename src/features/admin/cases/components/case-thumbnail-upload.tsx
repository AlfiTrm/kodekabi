"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

type CaseThumbnailUploadProps = {
  disabled?: boolean;
};

const maxSize = 5 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png"]);

export function CaseThumbnailUpload({ disabled = false }: CaseThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  function validateFile(file?: File) {
    if (!file) return;
    if (!acceptedTypes.has(file.type)) {
      setError("Gunakan file PNG atau JPG.");
      return;
    }
    if (file.size > maxSize) {
      setError("Ukuran file maksimal 5MB.");
      return;
    }

    setError("");
    setFileName(file.name);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    validateFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (disabled) return;

    const file = event.dataTransfer.files[0];
    if (!file || !acceptedTypes.has(file.type) || file.size > maxSize) {
      validateFile(file);
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (inputRef.current) inputRef.current.files = transfer.files;
    validateFile(file);
  }

  return (
    <div>
      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`grid min-h-40 place-items-center rounded-xl border border-dashed px-5 text-center transition-colors ${disabled ? "cursor-not-allowed border-border opacity-55" : "cursor-pointer border-border-strong bg-background hover:border-purple/60"}`}
      >
        <input ref={inputRef} type="file" name="thumbnail" accept="image/png,image/jpeg" required disabled={disabled} onChange={handleChange} className="sr-only" />
        <span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto size-7 fill-none stroke-current text-foreground/45" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M5 14v5h14v-5" /></svg>
          <strong className="mt-3 block text-xs font-medium text-foreground/60">{fileName || "Unggah thumbnail (PNG/JPG)"}</strong>
          <span className="mt-1.5 block text-[10px] text-foreground/30">Tarik file ke sini atau klik · maksimal 5MB</span>
        </span>
      </label>
      {error ? <p role="alert" className="mt-2 text-[10px] text-red">{error}</p> : null}
    </div>
  );
}
