"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { createAdminRedeemCode } from "../services/admin-redeem-codes-service";
import type { AdminRedeemCodeActionState } from "../types/admin-redeem-code";
import { redeemCodeActionError } from "./redeem-code-action-utils";

export async function createAdminRedeemCodeAction(_state: AdminRedeemCodeActionState, formData: FormData): Promise<AdminRedeemCodeActionState> {
  const redeemItemId = String(formData.get("redeem_item_id") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const expiresAt = String(formData.get("expires_at") ?? "").trim();
  if (!redeemItemId || !code || !expiresAt) return { error: "Item, kode redeem, dan tanggal kedaluwarsa wajib diisi." };

  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  try {
    await createAdminRedeemCode({ redeem_item_id: redeemItemId, code, expires_at: expiresAt }, token);
    revalidatePath("/admin/shop");
  } catch (error) {
    return { error: redeemCodeActionError(error, "Kode redeem gagal dibuat.") };
  }

  redirect("/admin/shop?tab=codes");
}
