"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { getUserAccessDuration, isUserAccessToken } from "@/src/features/auth/login/utils/user-token";
import { ApiError } from "@/src/shared/services/api/api-error";
import { REGISTER_SESSION_COOKIE } from "../constants/register-auth";
import {
  completeRegistration,
  selectRegistrationAvatar,
  startRegistration,
  verifyRegistrationOtp,
} from "../services/register-auth-service";
import type { RegisterActionState } from "../types/register-auth";
import { clearRegistrationCookies, saveRegistrationCookies } from "../utils/register-session";

function actionError(error: unknown, fallback: string): RegisterActionState {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 410) return { error: "Sesi registrasi sudah berakhir. Mulai kembali." };
    if (error.status === 409) return { error: error.message || "Data tersebut sudah digunakan." };
    if (error.status === 429) return { error: "Terlalu banyak percobaan. Coba lagi sebentar." };
    return { error: error.message };
  }
  return { error: fallback };
}

async function requiredSessionToken() {
  return (await cookies()).get(REGISTER_SESSION_COOKIE)?.value ?? null;
}

export async function startRegistrationAction(_state: RegisterActionState, formData: FormData): Promise<RegisterActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Lengkapi email dan password." };
  if (password.length < 8) return { error: "Password minimal 8 karakter." };

  try {
    const result = await startRegistration(email, password);
    if (!result.session_token) return { error: "Server tidak mengirim session token registrasi." };
    await saveRegistrationCookies(result.session_token, result.email || email, result.expires_at);
  } catch (error) {
    return actionError(error, "Registrasi belum dapat dimulai. Coba lagi.");
  }

  redirect("/register/verify");
}

export async function verifyRegistrationAction(_state: RegisterActionState, formData: FormData): Promise<RegisterActionState> {
  const code = String(formData.get("code") ?? "").replace(/\D/g, "");
  const token = await requiredSessionToken();
  if (!token) return { error: "Sesi registrasi tidak ditemukan. Mulai kembali." };
  if (code.length !== 6) return { error: "Masukkan 6 digit kode verifikasi." };

  try {
    await verifyRegistrationOtp(code, token);
  } catch (error) {
    return actionError(error, "Kode belum dapat diverifikasi.");
  }

  redirect("/register/detective");
}

export async function selectRegistrationAvatarAction(_state: RegisterActionState, formData: FormData): Promise<RegisterActionState> {
  const avatarId = String(formData.get("avatar_id") ?? "").trim();
  const token = await requiredSessionToken();
  if (!token) return { error: "Sesi registrasi tidak ditemukan. Mulai kembali." };
  if (!avatarId) return { error: "Pilih satu detektif untuk melanjutkan." };

  try {
    await selectRegistrationAvatar(avatarId, token);
  } catch (error) {
    return actionError(error, "Avatar belum dapat disimpan.");
  }

  redirect("/register/profile");
}

export async function completeRegistrationAction(_state: RegisterActionState, formData: FormData): Promise<RegisterActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const title = String(formData.get("title") ?? "Detektif Baru").trim();
  const token = await requiredSessionToken();

  if (!token) return { error: "Sesi registrasi tidak ditemukan. Mulai kembali." };
  if (!/^[A-Za-z0-9._]{3,16}$/.test(username)) return { error: "Nickname harus 3-16 karakter dan hanya memakai huruf, angka, titik, atau garis bawah." };

  try {
    const result = await completeRegistration(username, title, token);
    const accessToken = result.access_token ?? result.token;
    if (!accessToken || !isUserAccessToken(accessToken)) return { error: "Server tidak mengirim token pemain yang valid." };

    (await cookies()).set(USER_ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      maxAge: getUserAccessDuration(accessToken, result.expires_in),
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    await clearRegistrationCookies();
  } catch (error) {
    return actionError(error, "Profil belum dapat diselesaikan.");
  }

  redirect("/lobby");
}

