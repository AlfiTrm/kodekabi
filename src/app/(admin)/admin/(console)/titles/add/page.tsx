import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminCreateTitlePage } from "@/src/features/admin/titles/containers/admin-create-title-page";

export const metadata: Metadata = { title: "Tambah Title | KODEKABI Admin" };

export default async function AdminAddTitleRoute() {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  return <AdminCreateTitlePage />;
}
