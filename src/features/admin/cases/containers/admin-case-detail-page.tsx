import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { CaseDetailActions } from "../components/case-detail-actions";
import { CaseDetailSummary } from "../components/case-detail-summary";
import { CaseChatbotConfig } from "../components/case-chatbot-config";
import { CaseEvidenceTable } from "../components/case-evidence-table";
import { CaseQuestionsTable } from "../components/case-questions-table";
import { getAdminCaseDetail, getAdminCaseEvidences, getAdminCaseQuestions, resolveAdminCaseId } from "../services/admin-cases-service";

type AdminCaseDetailPageProps = {
  slug: string;
  caseIdHint?: string;
  activeTab?: "evidence" | "questions" | "chatbot";
};

export async function AdminCaseDetailPage({ slug, caseIdHint, activeTab = "evidence" }: AdminCaseDetailPageProps) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let caseId: string | null = null;
  try {
    caseId = await resolveAdminCaseId(slug, accessToken, caseIdHint);
    if (!caseId) notFound();
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
  }

  if (!caseId) {
    return <CaseDetailFailure />;
  }

  const [detailResult, evidencesResult, questionsResult] = await Promise.allSettled([
    getAdminCaseDetail(caseId, accessToken),
    getAdminCaseEvidences(caseId, accessToken),
    getAdminCaseQuestions(caseId, accessToken),
  ]);

  if (detailResult.status === "rejected") {
    return <CaseDetailFailure />;
  }

  const caseItem = detailResult.value.case;
  if (caseItem.slug.toLocaleLowerCase() !== decodeURIComponent(slug).toLocaleLowerCase()) {
    notFound();
  }

  const evidenceFailed = evidencesResult.status === "rejected";
  const evidences = evidenceFailed ? detailResult.value.evidences : evidencesResult.value.evidences;
  const evidenceTotal = evidenceFailed ? evidences.length : evidencesResult.value.total;
  const questionsFailed = questionsResult.status === "rejected";
  const questions = questionsFailed ? [] : questionsResult.value.questions;
  const questionTotal = questionsFailed ? 0 : questionsResult.value.total;
  const detailBaseHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}`;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Detail Case"
        description="Tinjau konfigurasi, statistik, dan kelengkapan data investigasi."
        breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">›</span><span className="text-purple">{caseItem.title}</span></>}
        action={<CaseDetailActions caseItem={caseItem} />}
      />

      <CaseDetailSummary caseItem={caseItem} />

      <nav id="workspace" className="mt-6 flex gap-2 overflow-x-auto border-b border-border text-xs" aria-label="Bagian detail case">
        <Link href={`${detailBaseHref}&tab=evidence#workspace`} aria-current={activeTab === "evidence" ? "page" : undefined} className={`shrink-0 px-5 py-3 font-semibold transition-colors ${activeTab === "evidence" ? "border-b-2 border-purple text-foreground" : "text-foreground/45 hover:text-foreground"}`}>Evidence</Link>
        <Link href={`${detailBaseHref}&tab=questions#workspace`} aria-current={activeTab === "questions" ? "page" : undefined} className={`shrink-0 px-5 py-3 font-semibold transition-colors ${activeTab === "questions" ? "border-b-2 border-purple text-foreground" : "text-foreground/45 hover:text-foreground"}`}>Questions</Link>
        <Link href={`${detailBaseHref}&tab=chatbot#workspace`} aria-current={activeTab === "chatbot" ? "page" : undefined} className={`shrink-0 px-5 py-3 font-semibold transition-colors ${activeTab === "chatbot" ? "border-b-2 border-purple text-foreground" : "text-foreground/45 hover:text-foreground"}`}>Chatbot Config</Link>
        <button type="button" disabled className="flex shrink-0 cursor-not-allowed items-center gap-2 px-5 py-3 text-foreground/30">Scoring &amp; Outcome <span className="rounded-lg bg-red/12 px-2 py-1 font-mono text-[8px] text-red">LOCKED</span></button>
      </nav>

      {activeTab === "questions" ? (
        <CaseQuestionsTable questions={questions} total={questionTotal} caseItem={caseItem} failed={questionsFailed} />
      ) : activeTab === "chatbot" ? (
        <CaseChatbotConfig caseItem={caseItem} />
      ) : (
        <CaseEvidenceTable evidences={evidences} total={evidenceTotal} caseItem={caseItem} failed={evidenceFailed} />
      )}
    </div>
  );
}

function CaseDetailFailure() {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Detail Case" description="Tinjau konfigurasi, statistik, dan kelengkapan data investigasi." />
      <section className="mt-6 rounded-2xl border border-red/25 bg-red/8"><AdminEmptyState title="Detail case gagal dimuat" description="Case tidak ditemukan atau koneksi API sedang bermasalah." /></section>
    </div>
  );
}
