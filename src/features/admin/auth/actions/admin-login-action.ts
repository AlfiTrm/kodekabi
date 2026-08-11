"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_ACCESS_DURATION_SECONDS,
  ADMIN_OTP_DURATION_SECONDS,
  ADMIN_OTP_EMAIL_COOKIE,
  ADMIN_OTP_EXPIRES_COOKIE,
  ADMIN_OTP_SESSION_COOKIE,
  ADMIN_REFRESH_COOKIE,
} from "../constants/admin-auth";
import { loginAdmin } from "../services/admin-auth-service";
import type { AdminLoginActionState } from "../types/admin-auth";
import { isAdminAccessToken } from "../utils/admin-token";

const genericLoginError = "Email atau password tidak valid.";

export async function adminLoginAction(_state: AdminLoginActionState, formData: FormData): Promise<AdminLoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Lengkapi email dan password." };
  }

  let destination = "/admin";

  try {
    const result = await loginAdmin({ email, password });
    const token = result.access_token ?? result.token;
    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production";
    const requiresOtp = result.requires_otp ?? Boolean(result.session_token);

    if (requiresOtp) {
      const sessionToken = result.session_token ?? token;

      if (!sessionToken) {
        return { error: "Respons login tidak menyertakan session token OTP." };
      }

      cookieStore.set(ADMIN_OTP_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        maxAge: ADMIN_OTP_DURATION_SECONDS,
        path: "/admin",
        sameSite: "lax",
        secure,
      });
      cookieStore.set(ADMIN_OTP_EMAIL_COOKIE, result.email ?? email, {
        httpOnly: true,
        maxAge: ADMIN_OTP_DURATION_SECONDS,
        path: "/admin",
        sameSite: "lax",
        secure,
      });
      cookieStore.set(ADMIN_OTP_EXPIRES_COOKIE, String(Date.now() + ADMIN_OTP_DURATION_SECONDS * 1000), {
        httpOnly: true,
        maxAge: ADMIN_OTP_DURATION_SECONDS,
        path: "/admin",
        sameSite: "lax",
        secure,
      });
      destination = "/admin/verify";
    } else {
      if (!token) {
        return { error: "Respons login tidak menyertakan token akses." };
      }
      if (!isAdminAccessToken(token)) {
        return { error: "Akun ini tidak memiliki akses administrator." };
      }

      cookieStore.set(ADMIN_ACCESS_COOKIE, token, {
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
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) return { error: genericLoginError };
      if (error.status === 429) return { error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." };
      return { error: error.message };
    }

    return { error: "Terjadi kesalahan. Coba lagi." };
  }

  redirect(destination);
}
