import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminVerifyPage } from "@/src/features/admin/auth/components/admin-verify-page";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_OTP_DURATION_SECONDS,
  ADMIN_OTP_EMAIL_COOKIE,
  ADMIN_OTP_EXPIRES_COOKIE,
  ADMIN_OTP_SESSION_COOKIE,
} from "@/src/features/admin/auth/constants/admin-auth";

export const metadata: Metadata = {
  title: "Verifikasi Admin | KODEKABI",
  description: "Verifikasi OTP administrator KODEKABI.",
};

export default async function AdminVerifyRoute() {
  const cookieStore = await cookies();

  if (cookieStore.has(ADMIN_ACCESS_COOKIE)) redirect("/admin");
  if (!cookieStore.has(ADMIN_OTP_SESSION_COOKIE)) redirect("/admin/login");

  const expiresAt = Number(cookieStore.get(ADMIN_OTP_EXPIRES_COOKIE)?.value);
  return (
    <AdminVerifyPage
      email={cookieStore.get(ADMIN_OTP_EMAIL_COOKIE)?.value ?? "email administrator"}
      initialSeconds={ADMIN_OTP_DURATION_SECONDS}
      expiresAt={Number.isFinite(expiresAt) ? expiresAt : undefined}
    />
  );
}
