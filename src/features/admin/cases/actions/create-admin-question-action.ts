"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { isAdminQuestionType } from "../data/question-form-options";
import { createAdminCaseQuestion } from "../services/admin-cases-service";
import type { CreateAdminQuestionActionState } from "../types/admin-case";
import { buildQuestionPayload, formValue } from "../utils/question-form-payload";

export async function createAdminQuestionAction(
  _state: CreateAdminQuestionActionState,
  formData: FormData,
): Promise<CreateAdminQuestionActionState> {
  const caseId = formValue(formData, "case_id");
  const versionId = formValue(formData, "version_id");
  const caseSlug = formValue(formData, "case_slug");
  const questionType = formValue(formData, "question_type");

  if (!caseId || !versionId || !caseSlug) return { error: "Identitas case tidak lengkap." };
  if (!isAdminQuestionType(questionType)) return { error: "Tipe question tidak valid." };
  const built = buildQuestionPayload(questionType, formData);
  if (!built.payload) return { error: built.error ?? "Payload question tidak valid." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await createAdminCaseQuestion(caseId, versionId, questionType, built.payload, accessToken);
    revalidatePath(`/admin/cases/${caseSlug}`);
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Question gagal disimpan. Coba lagi." };
  }

  redirect(`/admin/cases/${encodeURIComponent(caseSlug)}?caseId=${encodeURIComponent(caseId)}&tab=questions#workspace`);
}
