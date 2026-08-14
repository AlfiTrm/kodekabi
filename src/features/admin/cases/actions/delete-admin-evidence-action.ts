"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminCaseEvidence } from "../services/admin-cases-service";
import type { DeleteAdminEvidenceActionState } from "../types/admin-case";

function value(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function deleteAdminEvidenceAction(
  _state: DeleteAdminEvidenceActionState,
  formData: FormData,
): Promise<DeleteAdminEvidenceActionState> {
  const caseId = value(formData, "case_id");
  const versionId = value(formData, "version_id");
  const evidenceId = value(formData, "evidence_id");
  const caseSlug = value(formData, "case_slug");

  if (!caseId || !versionId || !evidenceId || !caseSlug) {
    return { error: "Identitas evidence tidak lengkap." };
  }

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await deleteAdminCaseEvidence(caseId, versionId, evidenceId, accessToken);
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/cases/${caseSlug}`);
    return { error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) return { error: "Evidence sudah tidak ditemukan." };
      return { error: error.message };
    }
    return { error: "Evidence gagal dihapus. Coba lagi." };
  }
}
