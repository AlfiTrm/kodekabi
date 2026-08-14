import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { EditEvidenceForm } from "../components/evidence-form/edit-evidence-form";
import type { AdminCase, AdminCaseEvidenceDetail } from "../types/admin-case";

export function AdminEditEvidencePage({ caseItem, evidence }: { caseItem: AdminCase; evidence: AdminCaseEvidenceDetail }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Edit Evidence"
        description="Perbarui isi evidence tanpa mengubah tipe template investigasinya."
        breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">›</span><Link href={`/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}`} className="transition-colors hover:text-purple">{caseItem.title}</Link><span className="mx-2">›</span><span className="text-purple">Edit Evidence</span></>}
      />
      <EditEvidenceForm caseItem={caseItem} evidence={evidence} />
    </div>
  );
}
