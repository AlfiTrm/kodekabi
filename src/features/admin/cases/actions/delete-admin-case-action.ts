"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminCase } from "../services/admin-cases-service";
import type { DeleteAdminCaseActionState } from "../types/admin-case";

export async function deleteAdminCaseAction(
  _state: DeleteAdminCaseActionState,
  formData: FormData,
): Promise<DeleteAdminCaseActionState> {
  const caseId = String(formData.get("case_id") ?? "").trim();
  if (!caseId) return { error: "ID case tidak ditemukan." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await deleteAdminCase(caseId, accessToken);
    revalidatePath("/admin/cases");
    redirect("/admin/cases");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    if (error instanceof ApiError) {
      if (error.status === 404) return { error: "Case sudah tidak ditemukan." };
      if (error.status === 409) return { error: "Case tidak dapat dihapus karena masih digunakan atau sudah dipublikasikan." };
      return { error: error.message };
    }

    return { error: "Case gagal dihapus. Coba lagi." };
  }
}
