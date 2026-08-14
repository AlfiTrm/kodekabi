"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { isEvidenceTemplateType } from "../data/evidence-form-options";
import { createAdminCaseEvidence } from "../services/admin-cases-service";
import type { CreateAdminEvidenceActionState, EvidenceTemplateType } from "../types/admin-case";
import { buildEvidencePayload, commonEvidencePayload, formText } from "../utils/evidence-form-payload";

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png"]);
function isValidDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return year >= 2020
    && year <= 2100
    && date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function validateTemplatePayload(templateType: EvidenceTemplateType, formData: FormData) {
  const requiredFields: Partial<Record<EvidenceTemplateType, Array<[string, string]>>> = {
    blog: [
      ["title", "Title"],
      ["author_name", "Author name"],
      ["blog_name", "Blog name"],
      ["publish_date", "Publish date"],
      ["body_text", "Body text"],
    ],
  };

  const missingField = requiredFields[templateType]?.find(([name]) => !formText(formData, name));
  if (missingField) return `${missingField[1]} wajib diisi.`;

  if (templateType === "blog" && !isValidDate(formText(formData, "publish_date"))) {
    return "Publish date harus berupa tanggal valid antara tahun 2020 dan 2100.";
  }

  return null;
}

export async function createAdminEvidenceAction(
  _state: CreateAdminEvidenceActionState,
  formData: FormData,
): Promise<CreateAdminEvidenceActionState> {
  const caseId = formText(formData, "case_id");
  const versionId = formText(formData, "version_id");
  const caseSlug = formText(formData, "case_slug");
  const templateValue = formText(formData, "template_type");
  const common = commonEvidencePayload(formData);

  if (!caseId || !versionId || !caseSlug) return { error: "Identitas case tidak lengkap." };
  if (!isEvidenceTemplateType(templateValue)) return { error: "Tipe evidence tidak valid." };
  if (!common.label) return { error: "Label evidence wajib diisi." };
  if (common.credibility_tags.length === 0) return { error: "Pilih minimal satu credibility tag." };
  if (common.sort_order < 1) return { error: "Urutan evidence minimal 1." };

  const validationError = validateTemplatePayload(templateValue, formData);
  if (validationError) return { error: validationError };

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!allowedImageTypes.has(image.type)) return { error: "Gambar evidence harus berformat PNG atau JPG." };
    if (image.size > maxImageSize) return { error: "Ukuran gambar evidence maksimal 5MB." };
  }

  const payload = buildEvidencePayload(templateValue, formData);

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await createAdminCaseEvidence(caseId, versionId, templateValue, payload, accessToken);
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/cases/${caseSlug}`);
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Evidence gagal disimpan. Coba lagi." };
  }

  redirect(`/admin/cases/${encodeURIComponent(caseSlug)}?caseId=${encodeURIComponent(caseId)}#workspace`);
}
