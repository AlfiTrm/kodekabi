"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { caseUnlockOptions, type CaseUnlockValue } from "../data/case-form-options";
import { createAdminCase } from "../services/admin-cases-service";
import type { CreateAdminCaseActionState } from "../types/admin-case";

const maxThumbnailSize = 5 * 1024 * 1024;
const allowedThumbnailTypes = new Set(["image/jpeg", "image/png"]);

export async function createAdminCaseAction(_state: CreateAdminCaseActionState, formData: FormData): Promise<CreateAdminCaseActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const shortDescription = String(formData.get("short_description") ?? "").trim();
  const theme = String(formData.get("theme") ?? "").trim();
  const themeOtherText = String(formData.get("theme_other_text") ?? "").trim();
  const competencyFocus = String(formData.get("competency_focus") ?? "").trim();
  const difficultyLevel = String(formData.get("difficulty_level") ?? "").trim();
  const riskLevel = String(formData.get("risk_level") ?? "").trim();
  const estimatedDuration = Number.parseInt(String(formData.get("estimated_duration_minutes") ?? ""), 10);
  const generationSource = String(formData.get("generation_source") ?? "manual").trim();
  const thumbnailPrompt = String(formData.get("thumbnail_prompt") ?? "").trim();
  const unlockValue = String(formData.get("unlock_requirement_type") ?? "open") as CaseUnlockValue;
  const unlockOption = caseUnlockOptions.find((option) => option.value === unlockValue) ?? caseUnlockOptions[0];
  const thumbnail = formData.get("thumbnail");

  if (!title || !shortDescription || !theme || !competencyFocus || !difficultyLevel || !riskLevel) {
    return { error: "Lengkapi seluruh informasi dasar case." };
  }
  if (title.length < 3 || title.length > 120) return { error: "Judul case harus terdiri dari 3-120 karakter." };
  if (shortDescription.length < 10 || shortDescription.length > 500) return { error: "Deskripsi singkat harus terdiri dari 10-500 karakter." };
  if (theme === "other" && !themeOtherText) return { error: "Jelaskan tema lainnya terlebih dahulu." };
  if (!Number.isFinite(estimatedDuration) || estimatedDuration < 1 || estimatedDuration > 240) return { error: "Estimasi durasi harus antara 1-240 menit." };
  if (!(thumbnail instanceof File) || thumbnail.size === 0) return { error: "Thumbnail case wajib diunggah." };
  if (!allowedThumbnailTypes.has(thumbnail.type)) return { error: "Thumbnail harus berformat PNG atau JPG." };
  if (thumbnail.size > maxThumbnailSize) return { error: "Ukuran thumbnail maksimal 5MB." };

  const payload = new FormData();
  payload.set("title", title);
  payload.set("short_description", shortDescription);
  payload.set("theme", theme);
  payload.set("theme_other_text", themeOtherText);
  payload.set("competency_focus", competencyFocus);
  payload.set("difficulty_level", difficultyLevel);
  payload.set("risk_level", riskLevel);
  payload.set("estimated_duration_minutes", String(estimatedDuration));
  payload.set("minimum_level", String(unlockOption.minimumLevel));
  payload.set("minimum_reputation", String(unlockOption.minimumReputation));
  payload.set("unlock_requirement", JSON.stringify({
    min_level: unlockOption.minimumLevel,
    min_reputation: unlockOption.minimumReputation,
    prerequisite_case_ids: [],
  }));
  payload.set("thumbnail_prompt", thumbnailPrompt);
  payload.set("generation_source", generationSource);
  payload.set("thumbnail", thumbnail);

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let createdCase: Awaited<ReturnType<typeof createAdminCase>>;
  try {
    createdCase = await createAdminCase(payload, accessToken);
    revalidatePath("/admin/cases");
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 422) return { error: error.message || "Data case tidak valid." };
      if (error.status === 413) return { error: "Thumbnail terlalu besar untuk diproses server." };
      return { error: error.message };
    }
    return { error: "Case gagal dibuat. Coba lagi." };
  }

  redirect(`/admin/cases/${encodeURIComponent(createdCase.slug)}?caseId=${encodeURIComponent(createdCase.case_id)}`);
}
