import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminCreateCasePage } from "@/src/features/admin/cases/containers/admin-create-case-page";
import { getAdminCaseLookups } from "@/src/features/admin/cases/services/admin-cases-service";

export const metadata: Metadata = {
  title: "Buat Case | KODEKABI Admin",
};

export default async function AdminCreateCaseRoute() {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let lookups: Awaited<ReturnType<typeof getAdminCaseLookups>>;
  try {
    lookups = await getAdminCaseLookups(accessToken);
  } catch {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <AdminDataError title="Form case gagal disiapkan." description="Data lookup tidak dapat dimuat. Periksa koneksi API lalu muat ulang halaman." />
      </div>
    );
  }

  return <AdminCreateCasePage lookups={lookups} />;
}
