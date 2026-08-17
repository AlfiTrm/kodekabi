"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminTitle } from "../services/admin-titles-service";
import type { AdminTitleActionState } from "../types/admin-title";
import { normalizeTitlePayload, titleActionError, validateTitleForm } from "./title-action-utils";

export async function updateAdminTitleAction(_state: AdminTitleActionState, formData: FormData): Promise<AdminTitleActionState> {
  const titleId = String(formData.get("title_id") ?? "").trim();
  if (!titleId) return { error: "ID title tidak ditemukan." };
  const validationError = validateTitleForm(formData, false);
  if (validationError) return { error: validationError };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await updateAdminTitle(titleId, normalizeTitlePayload(formData), accessToken);
    revalidatePath("/admin/titles");
    revalidatePath(`/admin/titles/${titleId}`);
  } catch (error) {
    return { error: titleActionError(error, "Title gagal diperbarui. Coba lagi.") };
  }

  redirect(`/admin/titles/${encodeURIComponent(titleId)}`);
}
