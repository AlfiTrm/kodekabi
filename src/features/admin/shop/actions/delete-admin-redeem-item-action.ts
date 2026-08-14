"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminRedeemItem } from "../services/admin-redeem-items-service";
import type { AdminRedeemItemActionState } from "../types/admin-redeem-item";
import { redeemItemActionError } from "./redeem-item-action-utils";

export async function deleteAdminRedeemItemAction(_state: AdminRedeemItemActionState, formData: FormData): Promise<AdminRedeemItemActionState> {
  const itemId = String(formData.get("redeem_item_id") ?? "");
  if (!itemId) return { error: "ID item redeem tidak valid." };
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try { await deleteAdminRedeemItem(itemId, token); revalidatePath("/admin/shop"); }
  catch (error) { return { error: redeemItemActionError(error, "Item redeem gagal dihapus.") }; }
  redirect("/admin/shop?tab=redeem");
}
