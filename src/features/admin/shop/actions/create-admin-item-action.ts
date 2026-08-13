"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { createAdminItem } from "../services/admin-items-service";
import type { AdminItemActionState } from "../types/admin-item";
import { itemActionError, normalizeItemPayload, validateItemForm } from "./item-action-utils";

export async function createAdminItemAction(_state: AdminItemActionState, formData: FormData): Promise<AdminItemActionState> {
  const validationError = validateItemForm(formData, true);
  if (validationError) return { error: validationError };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let itemId = "";
  try {
    const result = await createAdminItem(normalizeItemPayload(formData), accessToken);
    itemId = result.item.item_id;
    revalidatePath("/admin/shop");
  } catch (error) {
    return { error: itemActionError(error, "Item gagal dibuat. Coba lagi.") };
  }

  redirect(`/admin/shop/${encodeURIComponent(itemId)}`);
}

