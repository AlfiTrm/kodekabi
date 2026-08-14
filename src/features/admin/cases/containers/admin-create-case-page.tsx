import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { CreateCaseForm } from "../components/create-case-form";
import type { AdminCaseLookups } from "../types/admin-case";

export function AdminCreateCasePage({ lookups }: { lookups: AdminCaseLookups }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Buat Case Baru"
        description="Susun fondasi kasus sebelum menambahkan bukti dan pertanyaan."
        breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">›</span><span className="text-purple">Buat Case</span></>}
      />
      <CreateCaseForm lookups={lookups} />
    </div>
  );
}
