"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { createAdminRedeemItem } from "../services/admin-redeem-items-service";
import type { AdminRedeemItemActionState } from "../types/admin-redeem-item";
import { normalizeRedeemItemPayload, redeemItemActionError, validateRedeemItemForm } from "./redeem-item-action-utils";

export async function createAdminRedeemItemAction(_state: AdminRedeemItemActionState, formData: FormData): Promise<AdminRedeemItemActionState> {
  const validationError = validateRedeemItemForm(formData, true);
  if (validationError) return { error: validationError };
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  let itemId = "";
  try {
    const result = await createAdminRedeemItem(normalizeRedeemItemPayload(formData), token);
    itemId = result.item.redeem_item_id;
    revalidatePath("/admin/shop");
  } catch (error) { return { error: redeemItemActionError(error, "Item redeem gagal dibuat.") }; }
  redirect(`/admin/shop/redeem/${encodeURIComponent(itemId)}`);
}
