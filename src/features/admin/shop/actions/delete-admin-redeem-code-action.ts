"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminRedeemCode } from "../services/admin-redeem-codes-service";
import type { AdminRedeemCodeActionState } from "../types/admin-redeem-code";
import { redeemCodeActionError } from "./redeem-code-action-utils";

export async function deleteAdminRedeemCodeAction(_state: AdminRedeemCodeActionState, formData: FormData): Promise<AdminRedeemCodeActionState> {
  const redeemCodeId = String(formData.get("redeem_code_id") ?? "").trim();
  if (!redeemCodeId) return { error: "ID kode redeem tidak valid." };

  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  try {
    await deleteAdminRedeemCode(redeemCodeId, token);
    revalidatePath("/admin/shop");
  } catch (error) {
    return { error: redeemCodeActionError(error, "Kode redeem gagal dihapus.") };
  }

  redirect("/admin/shop?tab=codes");
}
