import { ApiError } from "@/src/shared/services/api/api-error";

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateRedeemItemForm(formData: FormData, imageRequired: boolean) {
  const required = ["name", "type", "partner_name", "description", "claim_period"];
  if (required.some((field) => !String(formData.get(field) ?? "").trim())) return "Semua field utama wajib diisi.";
  for (const field of ["price_coin", "max_claim_per_period", "minimum_level"]) {
    const value = Number(formData.get(field));
    if (!Number.isInteger(value) || value < 0) return "Harga, batas klaim, dan level minimum harus berupa angka valid.";
  }
  const image = formData.get("image");
  if (imageRequired && (!(image instanceof File) || image.size === 0)) return "Gambar item wajib diunggah.";
  if (image instanceof File && image.size > 0) {
    if (!acceptedImageTypes.has(image.type)) return "Gunakan gambar PNG, JPG, atau WEBP.";
    if (image.size > 5 * 1024 * 1024) return "Ukuran gambar maksimal 5MB.";
  }
  return null;
}

export function normalizeRedeemItemPayload(formData: FormData) {
  const payload = new FormData();
  ["name", "type", "partner_name", "price_coin", "max_claim_per_period", "claim_period", "minimum_level", "description", "is_stock_visible", "status"].forEach((field) => payload.set(field, String(formData.get(field) ?? "")));
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) payload.set("image", image);
  return payload;
}

export function redeemItemActionError(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message || fallback;
  return fallback;
}
