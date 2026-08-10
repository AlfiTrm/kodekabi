import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { CaseDetailActions } from "../components/case-detail-actions";
import { CaseDetailSummary } from "../components/case-detail-summary";
import { CaseEvidenceTable } from "../components/case-evidence-table";
import { getAdminCaseDetail, getAdminCaseEvidences, resolveAdminCaseId } from "../services/admin-cases-service";

type AdminCaseDetailPageProps = {
  slug: string;
  caseIdHint?: string;
};

export async function AdminCaseDetailPage({ slug, caseIdHint }: AdminCaseDetailPageProps) {
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

  const [detailResult, evidencesResult] = await Promise.allSettled([
    getAdminCaseDetail(caseId, accessToken),
    getAdminCaseEvidences(caseId, accessToken),
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
        <span className="shrink-0 border-b-2 border-purple px-5 py-3 font-semibold text-foreground">Evidence</span>
        <button type="button" disabled className="shrink-0 cursor-not-allowed px-5 py-3 text-foreground/40">Questions</button>
        <button type="button" disabled className="shrink-0 cursor-not-allowed px-5 py-3 text-foreground/40">Chatbot Config</button>
        <button type="button" disabled className="flex shrink-0 cursor-not-allowed items-center gap-2 px-5 py-3 text-foreground/30">Scoring &amp; Outcome <span className="rounded-lg bg-red/12 px-2 py-1 font-mono text-[8px] text-red">LOCKED</span></button>
      </nav>

      <CaseEvidenceTable evidences={evidences} total={evidenceTotal} caseItem={caseItem} failed={evidenceFailed} />
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
