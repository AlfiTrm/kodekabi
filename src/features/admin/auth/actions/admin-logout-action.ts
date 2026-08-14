"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_OTP_EMAIL_COOKIE,
  ADMIN_OTP_EXPIRES_COOKIE,
  ADMIN_OTP_SESSION_COOKIE,
  ADMIN_REFRESH_COOKIE,
} from "../constants/admin-auth";

export async function adminLogoutAction() {
  const cookieStore = await cookies();

  for (const cookieName of [ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE]) {
    cookieStore.set(cookieName, "", { maxAge: 0, path: "/" });
  }

  for (const cookieName of [ADMIN_OTP_SESSION_COOKIE, ADMIN_OTP_EMAIL_COOKIE, ADMIN_OTP_EXPIRES_COOKIE]) {
    cookieStore.set(cookieName, "", { maxAge: 0, path: "/admin" });
  }

  redirect("/admin/login");
}
