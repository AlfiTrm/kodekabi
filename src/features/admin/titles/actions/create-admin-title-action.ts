"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { createAdminTitle } from "../services/admin-titles-service";
import type { AdminTitleActionState } from "../types/admin-title";
import { normalizeTitlePayload, titleActionError, validateTitleForm } from "./title-action-utils";

export async function createAdminTitleAction(_state: AdminTitleActionState, formData: FormData): Promise<AdminTitleActionState> {
  const validationError = validateTitleForm(formData, true);
  if (validationError) return { error: validationError };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let titleId = "";
  try {
    const result = await createAdminTitle(normalizeTitlePayload(formData), accessToken);
    titleId = result.title.title_id;
    revalidatePath("/admin/titles");
  } catch (error) {
    return { error: titleActionError(error, "Title gagal dibuat. Coba lagi.") };
  }

  redirect(`/admin/titles/${encodeURIComponent(titleId)}`);
}
