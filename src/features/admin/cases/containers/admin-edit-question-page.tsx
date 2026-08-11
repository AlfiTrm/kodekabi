import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { EditQuestionForm } from "../components/question-form/edit-question-form";
import type { AdminCase, AdminQuestionDetail, AdminQuestionEvidenceOption } from "../types/admin-case";

export function AdminEditQuestionPage({ caseItem, question, evidences }: { caseItem: AdminCase; question: AdminQuestionDetail; evidences: AdminQuestionEvidenceOption[] }) {
  const caseHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}&tab=questions#workspace`;
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Edit Question" description="Perbarui isi dan penilaian tanpa mengubah tipe question." breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">&gt;</span><Link href={caseHref} className="transition-colors hover:text-purple">{caseItem.title}</Link><span className="mx-2">&gt;</span><span className="text-purple">Edit Question</span></>} />
      <EditQuestionForm caseItem={caseItem} question={question} evidences={evidences} />
    </div>
  );
}
