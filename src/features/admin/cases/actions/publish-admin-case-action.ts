"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { publishAdminCase } from "../services/admin-cases-service";
import type { PublishAdminCaseActionState } from "../types/admin-case";

export async function publishAdminCaseAction(
  _state: PublishAdminCaseActionState,
  formData: FormData,
): Promise<PublishAdminCaseActionState> {
  const caseId = String(formData.get("case_id") ?? "").trim();
  const caseSlug = String(formData.get("case_slug") ?? "").trim();

  if (!caseId || !caseSlug) {
    return { error: "Data case tidak lengkap.", success: null, requirements: [] };
  }

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    const result = await publishAdminCase(caseId, accessToken);
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/cases/${caseSlug}`);

    return {
      error: null,
      success: "Case berhasil dipublikasikan.",
      requirements: Array.isArray(result.requirements) ? result.requirements : [],
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) return { error: "Case tidak ditemukan.", success: null, requirements: [] };
      if (error.status === 409 || error.status === 422) {
        return { error: error.message || "Requirement publish belum terpenuhi.", success: null, requirements: [] };
      }
      return { error: error.message, success: null, requirements: [] };
    }

    return { error: "Case gagal dipublikasikan. Coba lagi.", success: null, requirements: [] };
  }
}
