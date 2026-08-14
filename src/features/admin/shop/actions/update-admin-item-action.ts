"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminItem } from "../services/admin-items-service";
import type { AdminItemActionState } from "../types/admin-item";
import { itemActionError, normalizeItemPayload, validateItemForm } from "./item-action-utils";

export async function updateAdminItemAction(_state: AdminItemActionState, formData: FormData): Promise<AdminItemActionState> {
  const itemId = String(formData.get("item_id") ?? "").trim();
  if (!itemId) return { error: "ID item tidak ditemukan." };
  const validationError = validateItemForm(formData, false);
  if (validationError) return { error: validationError };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await updateAdminItem(itemId, normalizeItemPayload(formData), accessToken);
    revalidatePath("/admin/shop");
    revalidatePath(`/admin/shop/${itemId}`);
  } catch (error) {
    return { error: itemActionError(error, "Item gagal diperbarui. Coba lagi.") };
  }

  redirect(`/admin/shop/${encodeURIComponent(itemId)}`);
}

