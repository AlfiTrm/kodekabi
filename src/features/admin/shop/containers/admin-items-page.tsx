import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminDataError } from "../../_shared/components/admin-data-error";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { ItemTabs } from "../components/item-tabs";
import { ItemsTable } from "../components/items-table";
import { RedeemItemsTable } from "../components/redeem-items-table";
import { getAdminRedeemItems } from "../services/admin-redeem-items-service";
import { getAdminItems } from "../services/admin-items-service";

export async function AdminItemsPage({ page, tab = "items" }: { page: number; tab?: "items" | "redeem" }) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let result: Awaited<ReturnType<typeof getAdminItems>> | Awaited<ReturnType<typeof getAdminRedeemItems>> | null = null;
  try {
    result = tab === "redeem" ? await getAdminRedeemItems({ page, limit: 10 }, accessToken) : await getAdminItems({ page, limit: 10 }, accessToken);
  } catch {
    result = null;
  }

  if (result && result.pagination.total_pages > 0 && page > result.pagination.total_pages) redirect(`/admin/shop?${tab === "redeem" ? "tab=redeem&" : ""}page=${result.pagination.total_pages}`);

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Shop & Redeem" description="Kelola katalog item game dan sistem penukaran koin KODEKABI." action={<Link href={tab === "redeem" ? "/admin/shop/redeem/add" : "/admin/shop/add"} className="grid h-11 place-items-center rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white">+ Tambah {tab === "redeem" ? "Item Redeem" : "Item Toko"}</Link>} />
      <div className="mt-6"><ItemTabs active={tab} /></div>
      <div className="mt-5">
        {result ? (tab === "redeem" ? <RedeemItemsTable items={result.items as never} pagination={result.pagination} /> : <ItemsTable items={result.items as never} pagination={result.pagination} />) : <AdminDataError title={`${tab === "redeem" ? "Item redeem" : "Item toko"} gagal dimuat.`} description="Struktur pengelolaan tetap dapat diakses. Periksa sesi admin atau koneksi API, lalu muat ulang data katalog." />}
      </div>
    </div>
  );
}
