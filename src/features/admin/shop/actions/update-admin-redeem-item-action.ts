"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminRedeemItem } from "../services/admin-redeem-items-service";
import type { AdminRedeemItemActionState } from "../types/admin-redeem-item";
import { normalizeRedeemItemPayload, redeemItemActionError, validateRedeemItemForm } from "./redeem-item-action-utils";

export async function updateAdminRedeemItemAction(_state: AdminRedeemItemActionState, formData: FormData): Promise<AdminRedeemItemActionState> {
  const itemId = String(formData.get("redeem_item_id") ?? "");
  const validationError = validateRedeemItemForm(formData, false);
  if (!itemId || validationError) return { error: validationError ?? "ID item redeem tidak valid." };
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    await updateAdminRedeemItem(itemId, normalizeRedeemItemPayload(formData), token);
    revalidatePath("/admin/shop"); revalidatePath(`/admin/shop/redeem/${itemId}`);
  } catch (error) { return { error: redeemItemActionError(error, "Item redeem gagal diperbarui.") }; }
  redirect(`/admin/shop/redeem/${encodeURIComponent(itemId)}`);
}
