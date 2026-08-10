import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { EditUserForm } from "../components/edit-user-form";
import { getAdminRoles, getAdminUserDetail, resolveAdminUserId } from "../services/admin-users-service";
import type { AdminRole, AdminUserDetail } from "../types/admin-user";

export async function AdminEditUserPage({ username }: { username: string }) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let user: AdminUserDetail | null = null;
  let roles: AdminRole[] = [];

  try {
    const userId = await resolveAdminUserId(username, accessToken);
    if (!userId) notFound();
    const [detail, roleList] = await Promise.all([getAdminUserDetail(userId, accessToken), getAdminRoles(accessToken)]);
    user = detail.user;
    roles = roleList;
    if (!roles.some((role) => role.role_name === user?.role_name)) roles = [{ role_id: user.role_id, role_name: user.role_name }, ...roles];
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
  }

  if (!user) {
    return <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><AdminEmptyState title="User gagal dimuat" description="Periksa koneksi API atau kembali ke daftar user." /></div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Edit User"
        description="Modifikasi kredensial dan status pengguna"
        breadcrumb={<><Link href="/admin/users" className="transition-colors hover:text-purple">Users</Link><span className="mx-2">›</span><Link href={`/admin/users/${encodeURIComponent(user.username)}`} className="transition-colors hover:text-purple">{user.username}</Link><span className="mx-2">›</span><span>Edit</span></>}
      />
      <EditUserForm user={user} roles={roles} />
    </div>
  );
}
