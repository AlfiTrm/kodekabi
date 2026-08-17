"use client";

import { useTitleImagePreview } from "../hooks/use-title-image-preview";

type TitleImageUploadProps = {
  initialUrl?: string;
  required?: boolean;
};

export function TitleImageUpload({ initialUrl = "", required = false }: TitleImageUploadProps) {
  const { previewUrl, fileName, error, handleImageChange } = useTitleImagePreview(initialUrl);

  return (
    <div>
      <label className="group relative grid min-h-52 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-border-strong bg-background transition-colors hover:border-purple/65">
        <input type="file" name="image" accept="image/png,image/jpeg,image/webp" required={required} onChange={handleImageChange} className="sr-only" />
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- Preview can be a local blob or dynamic API asset. */}
            <img src={previewUrl} alt="Pratinjau title" className="absolute inset-0 size-full object-contain p-5" />
            <span className="absolute inset-x-3 bottom-3 rounded-xl bg-background/85 px-3 py-2 text-center text-[10px] text-foreground/70 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">Klik untuk mengganti gambar</span>
          </>
        ) : (
          <span className="px-5 text-center">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto size-7 fill-none stroke-current text-foreground/45" strokeWidth="1.6"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M5 14v5h14v-5" /></svg>
            <strong className="mt-3 block text-xs font-semibold">Upload File Gambar</strong>
            <span className="mt-1.5 block text-[10px] text-foreground/35">PNG, JPG, atau WEBP, maksimal 5MB</span>
          </span>
        )}
      </label>
      {fileName ? <p className="mt-2 truncate text-[10px] text-foreground/40">{fileName}</p> : null}
      {error ? <p role="alert" className="mt-2 text-[10px] text-red">{error}</p> : null}
    </div>
  );
}
