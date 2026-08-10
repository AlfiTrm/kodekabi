import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "@/src/features/admin/_shared/components/admin-shell";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { isAdminAccessToken } from "@/src/features/admin/auth/utils/admin-token";

export default async function AdminConsoleLayout({ children }: LayoutProps<"/admin">) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;

  if (!accessToken || !isAdminAccessToken(accessToken)) redirect("/admin/login");

  return <AdminShell>{children}</AdminShell>;
}
