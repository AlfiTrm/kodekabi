import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AdminTitleForm } from "../components/admin-title-form";

export function AdminCreateTitlePage() {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Tambah Title"
        description="Masukkan detail title baru untuk ditampilkan pada profil pemain KODEKABI."
        breadcrumb={<><Link href="/admin/titles" className="hover:text-purple">Titles</Link><span className="mx-2">/</span>Tambah Title</>}
      />
      <div className="mt-7"><AdminTitleForm /></div>
    </div>
  );
}
