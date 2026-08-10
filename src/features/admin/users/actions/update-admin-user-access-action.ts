"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminUserAccess } from "../services/admin-users-service";
import type { UpdateAdminUserAccessActionState } from "../types/admin-user";

export async function updateAdminUserAccessAction(_state: UpdateAdminUserAccessActionState, formData: FormData): Promise<UpdateAdminUserAccessActionState> {
  const userId = String(formData.get("user_id") ?? "");
  const username = String(formData.get("username") ?? "");
  const roleName = String(formData.get("role_name") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!userId || !username || !roleName || !status) return { error: "Data akses user belum lengkap.", success: null };
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await updateAdminUserAccess(userId, { role_name: roleName, status }, accessToken);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${encodeURIComponent(username)}`);
    return { error: null, success: status === "active" ? "Akun berhasil diaktifkan." : "Akun berhasil disuspend." };
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message, success: null };
    return { error: "Akses user gagal diperbarui.", success: null };
  }
}
