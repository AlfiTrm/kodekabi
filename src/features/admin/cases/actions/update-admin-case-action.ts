"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminCase } from "../services/admin-cases-service";
import type { UpdateAdminCaseActionState } from "../types/admin-case";

const allowedThumbnailTypes = new Set(["image/jpeg", "image/png"]);
const maxThumbnailSize = 1 * 1024 * 1024;

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function updateAdminCaseAction(_state: UpdateAdminCaseActionState, formData: FormData): Promise<UpdateAdminCaseActionState> {
  const caseId = text(formData, "case_id");
  const caseSlug = text(formData, "case_slug");
  const title = text(formData, "title");
  const shortDescription = text(formData, "short_description");
  const duration = Number.parseInt(text(formData, "estimated_duration_minutes"), 10);
  const minimumLevel = Number.parseInt(text(formData, "minimum_level"), 10);
  const minimumReputation = Number.parseInt(text(formData, "minimum_reputation"), 10);

  if (!caseId || !caseSlug) return { error: "Identitas case tidak lengkap." };
  if (!title || title.length < 3) return { error: "Judul case minimal 3 karakter." };
  if (!shortDescription) return { error: "Deskripsi singkat wajib diisi." };
  if (!Number.isFinite(duration) || duration < 1) return { error: "Estimasi durasi tidak valid." };
  if (!Number.isFinite(minimumLevel) || minimumLevel < 0 || !Number.isFinite(minimumReputation) || minimumReputation < 0) return { error: "Syarat unlock tidak valid." };

  const thumbnail = formData.get("thumbnail");
  if (thumbnail instanceof File && thumbnail.size > 0) {
    if (!allowedThumbnailTypes.has(thumbnail.type)) return { error: "Thumbnail harus berformat PNG atau JPG." };
    if (thumbnail.size > maxThumbnailSize) return { error: "Ukuran thumbnail maksimal 1MB." };
  }

  const payload = new FormData();
  for (const name of ["title", "short_description", "theme", "theme_other_text", "competency_focus", "difficulty_level", "risk_level", "thumbnail_prompt", "generation_source"]) {
    payload.set(name, text(formData, name));
  }
  payload.set("estimated_duration_minutes", String(duration));
  payload.set("minimum_level", String(minimumLevel));
  payload.set("minimum_reputation", String(minimumReputation));
  payload.set("unlock_requirement", JSON.stringify({ min_level: minimumLevel, min_reputation: minimumReputation, prerequisite_case_ids: [] }));
  if (thumbnail instanceof File && thumbnail.size > 0) payload.set("thumbnail", thumbnail);

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let updatedCase: Awaited<ReturnType<typeof updateAdminCase>>;
  try {
    updatedCase = await updateAdminCase(caseId, payload, accessToken);
    if (!updatedCase || typeof updatedCase.slug !== "string" || !updatedCase.slug) {
      console.error("[admin-case] update returned an invalid case payload", { caseId });
      return { error: "Server mengembalikan data case yang tidak lengkap." };
    }
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/cases/${caseSlug}`);
    revalidatePath(`/admin/cases/${updatedCase.slug}`);
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    console.error("[admin-case] metadata update failed", { caseId, error });
    return { error: "Metadata case gagal diperbarui. Coba lagi." };
  }

  redirect(`/admin/cases/${encodeURIComponent(updatedCase.slug)}?caseId=${encodeURIComponent(caseId)}`);
}
