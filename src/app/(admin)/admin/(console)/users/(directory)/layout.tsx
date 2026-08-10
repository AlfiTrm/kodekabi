import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminRolesProvider } from "@/src/features/admin/users/context/admin-roles-context";
import { getAdminRoles } from "@/src/features/admin/users/services/admin-users-service";

export default async function AdminUsersDirectoryLayout({ children }: { children: React.ReactNode }) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  const roles = accessToken ? await getAdminRoles(accessToken).catch(() => []) : [];

  return <AdminRolesProvider roles={roles}>{children}</AdminRolesProvider>;
}
