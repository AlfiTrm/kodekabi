import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminEditQuestionPage } from "@/src/features/admin/cases/containers/admin-edit-question-page";
import { getAdminCaseDetail, getAdminCaseQuestionDetail, getAdminQuestionEvidenceOptions, resolveAdminCaseId } from "@/src/features/admin/cases/services/admin-cases-service";

export const metadata: Metadata = { title: "Edit Question | KODEKABI Admin" };

type EditQuestionRouteProps = {
  params: Promise<{ slug: string; questionId: string }>;
  searchParams: Promise<{ caseId?: string | string[]; versionId?: string | string[] }>;
};

export default async function EditQuestionRoute({ params, searchParams }: EditQuestionRouteProps) {
  const { slug, questionId } = await params;
  const query = await searchParams;
  const caseIdHint = typeof query.caseId === "string" ? query.caseId : undefined;
  const versionIdHint = typeof query.versionId === "string" ? query.versionId : undefined;
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  const result = await loadEditQuestion(slug, questionId, caseIdHint, versionIdHint, accessToken);
  if (!result) return <EditQuestionFailure />;
  if (result.caseItem.slug.toLocaleLowerCase() !== decodeURIComponent(slug).toLocaleLowerCase()) notFound();

  return <AdminEditQuestionPage caseItem={result.caseItem} question={result.question} evidences={result.evidences} />;
}

async function loadEditQuestion(slug: string, questionId: string, caseIdHint: string | undefined, versionIdHint: string | undefined, accessToken: string) {
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

function EditQuestionFailure() {
  return <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><AdminDataError title="Form edit question gagal disiapkan." description="Detail question atau evidence options tidak dapat dimuat. Periksa koneksi API lalu coba lagi." /></div>;
}
