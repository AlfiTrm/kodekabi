"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE, ADMIN_ACCESS_DURATION_SECONDS, ADMIN_OTP_EMAIL_COOKIE, ADMIN_OTP_EXPIRES_COOKIE, ADMIN_OTP_SESSION_COOKIE, ADMIN_REFRESH_COOKIE } from "../constants/admin-auth";
import { verifyAdminOtp } from "../services/admin-auth-service";
import type { AdminVerifyActionState } from "../types/admin-auth";
import { isAdminAccessToken } from "../utils/admin-token";

export async function adminVerifyAction(_state: AdminVerifyActionState, formData: FormData): Promise<AdminVerifyActionState> {
  const code = String(formData.get("code") ?? "").trim();

  if (!/^\d{6}$/.test(code)) {
    return { error: "Masukkan 6 digit kode verifikasi." };
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_OTP_SESSION_COOKIE)?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  try {
    const result = await verifyAdminOtp(code, sessionToken);

    if (result.requires_otp || !result.token) {
      return { error: "Verifikasi belum selesai. Periksa kembali kode OTP." };
    }
    if (!isAdminAccessToken(result.token)) {
      return { error: "Akun ini tidak memiliki akses administrator." };
    }

    const secure = process.env.NODE_ENV === "production";
    cookieStore.set(ADMIN_ACCESS_COOKIE, result.token, {
      httpOnly: true,
      maxAge: result.expires_in ?? ADMIN_ACCESS_DURATION_SECONDS,
      path: "/",
      sameSite: "lax",
      secure,
    });

    if (result.refresh_token) {
      cookieStore.set(ADMIN_REFRESH_COOKIE, result.refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
        secure,
      });
    }

    cookieStore.set(ADMIN_OTP_SESSION_COOKIE, "", { maxAge: 0, path: "/admin" });
    cookieStore.set(ADMIN_OTP_EMAIL_COOKIE, "", { maxAge: 0, path: "/admin" });
    cookieStore.set(ADMIN_OTP_EXPIRES_COOKIE, "", { maxAge: 0, path: "/admin" });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 422) return { error: "Kode OTP tidak valid atau sudah kedaluwarsa." };
      if (error.status === 429) return { error: "Terlalu banyak percobaan. Akun dikunci sementara." };
      return { error: error.message };
    }

    return { error: "Verifikasi gagal. Coba lagi." };
  }

  redirect("/admin");
}
