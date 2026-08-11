"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { isAdminQuestionType } from "../data/question-form-options";
import { updateAdminCaseQuestion } from "../services/admin-cases-service";
import type { UpdateAdminQuestionActionState } from "../types/admin-case";
import { buildQuestionPayload, formValue } from "../utils/question-form-payload";

export async function updateAdminQuestionAction(
  _state: UpdateAdminQuestionActionState,
  formData: FormData,
): Promise<UpdateAdminQuestionActionState> {
  const caseId = formValue(formData, "case_id");
  const versionId = formValue(formData, "version_id");
  const questionId = formValue(formData, "question_id");
  const caseSlug = formValue(formData, "case_slug");
  const questionType = formValue(formData, "question_type");

  if (!caseId || !versionId || !questionId || !caseSlug) return { error: "Identitas question tidak lengkap." };
  if (!isAdminQuestionType(questionType)) return { error: "Tipe question tidak valid." };

  const built = buildQuestionPayload(questionType, formData);
  if (!built.payload) return { error: built.error ?? "Payload question tidak valid." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await updateAdminCaseQuestion(caseId, versionId, questionId, questionType, built.payload, accessToken);
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/cases/${caseSlug}`);
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Question gagal diperbarui. Coba lagi." };
  }

  redirect(`/admin/cases/${encodeURIComponent(caseSlug)}?caseId=${encodeURIComponent(caseId)}&tab=questions#workspace`);
}
