"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminUser } from "../services/admin-users-service";
import type { UpdateAdminUserActionState, UpdateAdminUserRequest } from "../types/admin-user";

export async function updateAdminUserAction(_state: UpdateAdminUserActionState, formData: FormData): Promise<UpdateAdminUserActionState> {
  const userId = String(formData.get("user_id") ?? "");
  const previousUsername = String(formData.get("previous_username") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");
  const payload: UpdateAdminUserRequest = {
    username: String(formData.get("username") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    role_name: String(formData.get("role_name") ?? "").trim(),
    status: String(formData.get("status") ?? "").trim(),
    ...(password ? { password, password_confirmation: passwordConfirmation } : {}),
  };

  if (!userId || !payload.username || !payload.email || !payload.role_name || !payload.status) return { error: "Data user belum lengkap." };
  if (!/^\S+@\S+\.\S+$/.test(payload.email)) return { error: "Format email tidak valid." };
  if (payload.username.length < 3 || payload.username.length > 32) return { error: "Username harus terdiri dari 3-32 karakter." };
  if (password && password.length < 8) return { error: "Password baru minimal 8 karakter." };
  if (password && password !== passwordConfirmation) return { error: "Konfirmasi password baru tidak cocok." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    const result = await updateAdminUser(userId, payload, accessToken);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${encodeURIComponent(previousUsername)}`);
    redirect(`/admin/users/${encodeURIComponent(result.user.username)}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    if (error instanceof ApiError) {
      if (error.status === 409) return { error: "Email atau username sudah digunakan." };
      if (error.status === 422) return { error: error.message || "Data user tidak valid." };
      return { error: error.message };
    }
    return { error: "Perubahan user gagal disimpan." };
  }
}
