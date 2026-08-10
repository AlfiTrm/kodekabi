import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AddEvidenceForm } from "../components/evidence-form/add-evidence-form";
import { evidenceTemplateOptions } from "../data/evidence-form-options";
import type { AdminCase } from "../types/admin-case";

export function AdminAddEvidencePage({ caseItem }: { caseItem: AdminCase }) {
  const firstTemplate = evidenceTemplateOptions[0];
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Tambah Evidence"
        description={`Buat evidence baru. Form akan menyesuaikan tipe ${firstTemplate.label} dan lima format investigasi lainnya.`}
        breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">›</span><Link href={`/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}`} className="transition-colors hover:text-purple">{caseItem.title}</Link><span className="mx-2">›</span><span className="text-purple">Tambah Evidence</span></>}
      />
      <AddEvidenceForm caseItem={caseItem} nextSortOrder={Math.max(1, caseItem.evidence_count + 1)} />
    </div>
  );
}
