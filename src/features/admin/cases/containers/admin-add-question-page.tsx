import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AddQuestionForm } from "../components/question-form/add-question-form";
import type { AdminCase, AdminQuestionEvidenceOption } from "../types/admin-case";

export function AdminAddQuestionPage({ caseItem, evidences, nextSortOrder }: { caseItem: AdminCase; evidences: AdminQuestionEvidenceOption[]; nextSortOrder: number }) {
  const detailHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}&tab=questions`;
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Tambah Question" description="Buat pertanyaan investigasi dan hubungkan dengan evidence yang relevan." breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">›</span><Link href={detailHref} className="transition-colors hover:text-purple">{caseItem.title}</Link><span className="mx-2">›</span><span className="text-purple">Tambah Question</span></>} />
      <AddQuestionForm caseItem={caseItem} evidences={evidences} nextSortOrder={nextSortOrder} />
    </div>
  );
}
