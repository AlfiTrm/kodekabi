import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminQuestionDetailPage } from "@/src/features/admin/cases/containers/admin-question-detail-page";
import { getAdminCaseDetail, getAdminCaseQuestionDetail, getAdminQuestionEvidenceOptions, resolveAdminCaseId } from "@/src/features/admin/cases/services/admin-cases-service";

export const metadata: Metadata = { title: "Detail Question | KODEKABI Admin" };

type QuestionDetailRouteProps = {
  params: Promise<{ slug: string; questionId: string }>;
  searchParams: Promise<{ caseId?: string | string[]; versionId?: string | string[] }>;
};

export default async function QuestionDetailRoute({ params, searchParams }: QuestionDetailRouteProps) {
  const { slug, questionId } = await params;
  const query = await searchParams;
  const caseIdHint = typeof query.caseId === "string" ? query.caseId : undefined;
  const versionIdHint = typeof query.versionId === "string" ? query.versionId : undefined;
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  const result = await loadQuestionDetail(slug, questionId, caseIdHint, versionIdHint, accessToken);
  if (!result) return <QuestionDetailFailure />;
  if (result.caseItem.slug.toLocaleLowerCase() !== decodeURIComponent(slug).toLocaleLowerCase()) notFound();

  return <AdminQuestionDetailPage caseItem={result.caseItem} question={result.question} evidences={result.evidences} />;
}

async function loadQuestionDetail(slug: string, questionId: string, caseIdHint: string | undefined, versionIdHint: string | undefined, accessToken: string) {
  try {
    const caseId = await resolveAdminCaseId(slug, accessToken, caseIdHint);
    if (!caseId) return null;
    const detail = await getAdminCaseDetail(caseId, accessToken);
    const versionId = versionIdHint || detail.case.current_case_version_id;
    const [questionDetail, evidenceOptions] = await Promise.all([
      getAdminCaseQuestionDetail(caseId, versionId, questionId, accessToken),
      getAdminQuestionEvidenceOptions(caseId, accessToken),
    ]);
    return { caseItem: detail.case, question: questionDetail.question, evidences: evidenceOptions.evidences };
  } catch {
    return null;
  }
}

function QuestionDetailFailure() {
  return <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><AdminDataError title="Question gagal dimuat." description="Detail question tidak tersedia atau koneksi API sedang bermasalah." /></div>;
}
