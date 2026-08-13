import Link from "next/link";
import { AdminDataError } from "../../_shared/components/admin-data-error";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AdminRedeemItemForm } from "../components/admin-redeem-item-form";
import type { AdminRedeemType } from "../types/admin-redeem-item";

export function AdminCreateRedeemItemPage({ types, typeError }: { types: AdminRedeemType[]; typeError?: string }) {
  return <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <AdminPageHeader title="Tambah Item Redeem" description="Masukkan detail item baru untuk sistem penukaran koin." breadcrumb={<><Link href="/admin/shop?tab=redeem" className="hover:text-purple">Shop & Redeem</Link><span className="mx-2">/</span>Tambah Item Redeem</>} />
    {typeError ? <div className="mt-6"><AdminDataError title="Tipe redeem belum dapat dimuat." description={typeError} /></div> : null}
    <div className="mt-7"><AdminRedeemItemForm types={types} /></div>
  </div>;
}
