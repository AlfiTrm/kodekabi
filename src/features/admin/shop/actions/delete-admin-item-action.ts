"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminItem } from "../services/admin-items-service";
import type { AdminItemActionState } from "../types/admin-item";
import { itemActionError } from "./item-action-utils";

export async function deleteAdminItemAction(_state: AdminItemActionState, formData: FormData): Promise<AdminItemActionState> {
  const itemId = String(formData.get("item_id") ?? "").trim();
  if (!itemId) return { error: "ID item tidak ditemukan." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await deleteAdminItem(itemId, accessToken);
    revalidatePath("/admin/shop");
  } catch (error) {
    return { error: itemActionError(error, "Item gagal dihapus. Coba lagi.") };
  }

  redirect("/admin/shop");
}

