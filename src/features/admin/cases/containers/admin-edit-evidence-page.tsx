import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { EditEvidenceForm } from "../components/evidence-form/edit-evidence-form";
import type { AdminCase, AdminCaseEvidenceDetail } from "../types/admin-case";

export function AdminEditEvidencePage({ caseItem, evidence, rawResponse }: { caseItem: AdminCase; evidence: AdminCaseEvidenceDetail; rawResponse?: unknown }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Edit Evidence"
        description="Perbarui isi evidence tanpa mengubah tipe template investigasinya."
        breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">›</span><Link href={`/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}`} className="transition-colors hover:text-purple">{caseItem.title}</Link><span className="mx-2">›</span><span className="text-purple">Edit Evidence</span></>}
      />
      <EditEvidenceForm caseItem={caseItem} evidence={evidence} />
      {rawResponse ? (
        <details className="mt-5 rounded-2xl border border-border bg-surface p-5 open:pb-6">
          <summary className="cursor-pointer font-display text-sm font-semibold">Raw Response — getAdminCaseEvidenceDetail</summary>
          <pre className="mt-4 max-h-[480px] overflow-auto rounded-xl border border-border bg-background p-4 font-mono text-[11px] leading-5 text-foreground/80">{JSON.stringify(rawResponse, null, 2)}</pre>
        </details>
      ) : null}
    </div>
  );
}
