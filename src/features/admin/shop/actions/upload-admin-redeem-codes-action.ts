"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { uploadAdminRedeemCodes } from "../services/admin-redeem-codes-service";
import type { AdminRedeemCodeActionState } from "../types/admin-redeem-code";
import { redeemCodeActionError } from "./redeem-code-action-utils";

const MAX_CSV_SIZE = 2 * 1024 * 1024;

export async function uploadAdminRedeemCodesAction(_state: AdminRedeemCodeActionState, formData: FormData): Promise<AdminRedeemCodeActionState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Pilih file CSV yang akan diunggah." };
  if (!file.name.toLowerCase().endsWith(".csv")) return { error: "Format file harus CSV." };
  if (file.size > MAX_CSV_SIZE) return { error: "Ukuran file CSV maksimal 2MB." };

  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  try {
    await uploadAdminRedeemCodes(file, token);
    revalidatePath("/admin/shop");
  } catch (error) {
    return { error: redeemCodeActionError(error, "Batch kode redeem gagal diunggah.") };
  }

  redirect("/admin/shop?tab=codes");
}
