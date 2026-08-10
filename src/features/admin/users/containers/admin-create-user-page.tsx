import Link from "next/link";
import { cookies } from "next/headers";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { CreateUserForm } from "../components/create-user-form";
import { getAdminRoles } from "../services/admin-users-service";

export async function AdminCreateUserPage() {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  const roles = accessToken ? await getAdminRoles(accessToken).catch(() => []) : [];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Tambah User"
        description="Daftarkan pengguna baru ke sistem KODEKABI"
        breadcrumb={<><Link href="/admin/users" className="transition-colors hover:text-purple">Users</Link><span className="mx-2">›</span><span>Tambah User</span></>}
      />
      <CreateUserForm roles={roles} />
    </div>
  );
}
