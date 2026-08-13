import { ApiError } from "@/src/shared/services/api/api-error";

const maxImageSize = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateItemForm(formData: FormData, imageRequired: boolean) {
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("item_category_id") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCoin = Number.parseInt(String(formData.get("price_coin") ?? ""), 10);
  const image = formData.get("image");

  if (!name || !categoryId || !description || !Number.isFinite(priceCoin)) return "Semua field utama wajib diisi.";
  if (name.length > 100) return "Nama item maksimal 100 karakter.";
  if (priceCoin < 0) return "Harga koin tidak boleh negatif.";
  if (imageRequired && (!(image instanceof File) || image.size === 0)) return "Gambar item wajib diunggah.";
  if (image instanceof File && image.size > 0) {
    if (!acceptedImageTypes.has(image.type)) return "Gunakan gambar PNG, JPG, atau WEBP.";
    if (image.size > maxImageSize) return "Ukuran gambar maksimal 5MB.";
  }

  return null;
}

export function normalizeItemPayload(formData: FormData) {
  const payload = new FormData();
  const fields = ["name", "item_category_id", "description", "price_coin", "is_visible", "is_featured", "status"];
  fields.forEach((field) => payload.set(field, String(formData.get(field) ?? "")));

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) payload.set("image", image);
  return payload;
}

export function itemActionError(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.status === 409) return "Item dengan data tersebut sudah tersedia.";
    if (error.status === 422 || error.status === 400) return error.message || "Data item tidak valid.";
    return error.message;
  }
  return fallback;
}

