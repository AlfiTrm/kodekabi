"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminTitle } from "../services/admin-titles-service";
import type { AdminTitleActionState } from "../types/admin-title";
import { titleActionError } from "./title-action-utils";

export async function deleteAdminTitleAction(_state: AdminTitleActionState, formData: FormData): Promise<AdminTitleActionState> {
  const titleId = String(formData.get("title_id") ?? "").trim();
  if (!titleId) return { error: "ID title tidak ditemukan." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await deleteAdminTitle(titleId, accessToken);
    revalidatePath("/admin/titles");
  } catch (error) {
    return { error: titleActionError(error, "Title gagal dihapus. Coba lagi.") };
  }

  redirect("/admin/titles");
}
