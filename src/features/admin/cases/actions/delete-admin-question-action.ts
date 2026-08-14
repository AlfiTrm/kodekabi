"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminCaseQuestion } from "../services/admin-cases-service";
import type { DeleteAdminQuestionActionState } from "../types/admin-case";
import { formValue } from "../utils/question-form-payload";

export async function deleteAdminQuestionAction(
  _state: DeleteAdminQuestionActionState,
  formData: FormData,
): Promise<DeleteAdminQuestionActionState> {
  const caseId = formValue(formData, "case_id");
  const versionId = formValue(formData, "version_id");
  const questionId = formValue(formData, "question_id");
  const caseSlug = formValue(formData, "case_slug");

  if (!caseId || !versionId || !questionId || !caseSlug) return { error: "Identitas question tidak lengkap." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await deleteAdminCaseQuestion(caseId, versionId, questionId, accessToken);
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/cases/${caseSlug}`);
    return { error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) return { error: "Question sudah tidak ditemukan." };
      return { error: error.message };
    }
    return { error: "Question gagal dihapus. Coba lagi." };
  }
}
