import Link from "next/link";

import { AdminDataError } from "../../_shared/components/admin-data-error";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AdminItemForm } from "../components/admin-item-form";
import type { AdminItemCategory } from "../types/admin-item";

type AdminCreateItemPageProps = {
  categories: AdminItemCategory[];
  categoryError?: string;
};

export function AdminCreateItemPage({ categories, categoryError }: AdminCreateItemPageProps) {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Tambah Item"
        description="Masukkan detail item baru untuk ditampilkan di Shop KODEKABI."
        breadcrumb={<><Link href="/admin/shop" className="hover:text-purple">Shop & Redeem</Link><span className="mx-2">/</span>Tambah Item</>}
      />
      {categoryError ? <div className="mt-6"><AdminDataError title="Kategori item belum dapat dimuat." description={categoryError} /></div> : null}
      <div className="mt-7"><AdminItemForm categories={categories} /></div>
    </div>
  );
}
