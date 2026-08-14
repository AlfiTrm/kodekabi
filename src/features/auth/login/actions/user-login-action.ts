"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { USER_ACCESS_COOKIE } from "../constants/user-auth";
import { loginUser } from "../services/user-auth-service";
import type { UserLoginActionState } from "../types/user-login";
import { getUserAccessDuration, isUserAccessToken } from "../utils/user-token";

const invalidCredentialsMessage = "Email atau password tidak valid.";

export async function userLoginAction(_state: UserLoginActionState, formData: FormData): Promise<UserLoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Lengkapi email dan password." };

  try {
    const result = await loginUser({ email, password });
    const token = result.access_token ?? result.token;

    if (!token) return { error: "Respons login tidak menyertakan token akses." };
    if (!isUserAccessToken(token)) return { error: "Akun ini tidak memiliki akses pemain." };

    (await cookies()).set(USER_ACCESS_COOKIE, token, {
      httpOnly: true,
      maxAge: getUserAccessDuration(token, result.expires_in),
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) return { error: invalidCredentialsMessage };
      if (error.status === 429) return { error: "Terlalu banyak percobaan. Coba lagi beberapa saat." };
      return { error: error.message };
    }
    return { error: "Terjadi kesalahan. Coba lagi." };
  }

  redirect("/lobby");
}
