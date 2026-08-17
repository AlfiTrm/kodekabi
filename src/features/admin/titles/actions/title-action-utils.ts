import { ApiError } from "@/src/shared/services/api/api-error";

const maxImageSize = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateTitleForm(formData: FormData, imageRequired: boolean) {
  const title = String(formData.get("title") ?? "").trim();
  const unlockLevel = Number.parseInt(String(formData.get("unlock_level") ?? ""), 10);
  const image = formData.get("image");

  if (!title) return "Nama title wajib diisi.";
  if (title.length > 100) return "Nama title maksimal 100 karakter.";
  if (!Number.isFinite(unlockLevel) || unlockLevel < 0) return "Unlock level harus angka minimal 0.";
  if (imageRequired && (!(image instanceof File) || image.size === 0)) return "Gambar title wajib diunggah.";
  if (image instanceof File && image.size > 0) {
    if (!acceptedImageTypes.has(image.type)) return "Gunakan gambar PNG, JPG, atau WEBP.";
    if (image.size > maxImageSize) return "Ukuran gambar maksimal 5MB.";
  }

  return null;
}

export function normalizeTitlePayload(formData: FormData) {
  const payload = new FormData();
  const fields = ["title", "unlock_level", "status"];
  fields.forEach((field) => payload.set(field, String(formData.get(field) ?? "")));

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) payload.set("image", image);
  return payload;
}

export function titleActionError(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.status === 409) return "Title dengan data tersebut sudah tersedia.";
    if (error.status === 422 || error.status === 400) return error.message || "Data title tidak valid.";
    return error.message;
  }
  return fallback;
}
