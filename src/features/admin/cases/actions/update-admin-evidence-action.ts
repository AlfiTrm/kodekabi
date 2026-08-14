"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { isEvidenceTemplateType } from "../data/evidence-form-options";
import { updateAdminCaseEvidence } from "../services/admin-cases-service";
import type { UpdateAdminEvidenceActionState } from "../types/admin-case";
import { buildEvidencePayload, commonEvidencePayload, formText } from "../utils/evidence-form-payload";

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png"]);

export async function updateAdminEvidenceAction(
  _state: UpdateAdminEvidenceActionState,
  formData: FormData,
): Promise<UpdateAdminEvidenceActionState> {
  const caseId = formText(formData, "case_id");
  const versionId = formText(formData, "version_id");
  const evidenceId = formText(formData, "evidence_id");
  const caseSlug = formText(formData, "case_slug");
  const templateValue = formText(formData, "template_type");
  const common = commonEvidencePayload(formData);

  if (!caseId || !versionId || !evidenceId || !caseSlug) return { error: "Identitas evidence tidak lengkap." };
  if (!isEvidenceTemplateType(templateValue)) return { error: "Tipe evidence tidak valid." };
  if (!common.label) return { error: "Label evidence wajib diisi." };
  if (common.credibility_tags.length === 0) return { error: "Pilih minimal satu credibility tag." };

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!allowedImageTypes.has(image.type)) return { error: "Gambar evidence harus berformat PNG atau JPG." };
    if (image.size > maxImageSize) return { error: "Ukuran gambar evidence maksimal 5MB." };
  }

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await updateAdminCaseEvidence(caseId, versionId, evidenceId, templateValue, buildEvidencePayload(templateValue, formData), accessToken);
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/cases/${caseSlug}`);
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Evidence gagal diperbarui. Coba lagi." };
  }

  redirect(`/admin/cases/${encodeURIComponent(caseSlug)}?caseId=${encodeURIComponent(caseId)}#workspace`);
}
