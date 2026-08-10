"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { createAdminUser } from "../services/admin-users-service";
import type { CreateAdminUserActionState, CreateAdminUserRequest } from "../types/admin-user";

export async function createAdminUserAction(_state: CreateAdminUserActionState, formData: FormData): Promise<CreateAdminUserActionState> {
  const payload: CreateAdminUserRequest = {
    username: String(formData.get("username") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    password_confirmation: String(formData.get("password_confirmation") ?? ""),
    role_name: String(formData.get("role_name") ?? "").trim(),
    status: String(formData.get("status") ?? "active").trim(),
  };

  if (!payload.username || !payload.email || !payload.password || !payload.password_confirmation || !payload.role_name) {
    return { error: "Semua field wajib diisi." };
  }
  if (!/^\S+@\S+\.\S+$/.test(payload.email)) return { error: "Format email tidak valid." };
  if (payload.username.length < 3 || payload.username.length > 32) return { error: "Username harus terdiri dari 3-32 karakter." };
  if (payload.password.length < 8) return { error: "Password minimal 8 karakter." };
  if (payload.password !== payload.password_confirmation) return { error: "Konfirmasi password tidak cocok." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    const result = await createAdminUser(payload, accessToken);
    revalidatePath("/admin/users");
    redirect(`/admin/users/${encodeURIComponent(result.user.username)}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    if (error instanceof ApiError) {
      if (error.status === 409) return { error: "Email atau username sudah digunakan." };
      if (error.status === 422) return { error: error.message || "Data user tidak valid." };
      return { error: error.message };
    }
    return { error: "User gagal dibuat. Coba lagi." };
  }
}
