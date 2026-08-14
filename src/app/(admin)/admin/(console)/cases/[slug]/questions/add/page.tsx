import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminAddQuestionPage } from "@/src/features/admin/cases/containers/admin-add-question-page";
import { getAdminCaseDetail, getAdminCaseQuestions, getAdminQuestionEvidenceOptions, resolveAdminCaseId } from "@/src/features/admin/cases/services/admin-cases-service";

export const metadata: Metadata = { title: "Tambah Question | KODEKABI Admin" };

type AddQuestionRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ caseId?: string | string[] }>;
};

export default async function AddQuestionRoute({ params, searchParams }: AddQuestionRouteProps) {
  const { slug } = await params;
  const query = await searchParams;
  const caseIdHint = typeof query.caseId === "string" ? query.caseId : undefined;
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let caseId: string | null = null;
  let resolveFailed = false;
  try {
    caseId = await resolveAdminCaseId(slug, accessToken, caseIdHint);
  } catch {
    resolveFailed = true;
  }
  if (resolveFailed) return <QuestionRouteFailure />;
  if (!caseId) notFound();

  let routeData: Awaited<ReturnType<typeof loadQuestionRouteData>> | null = null;
  try {
    routeData = await loadQuestionRouteData(caseId, accessToken);
  } catch {
    // The failure UI is rendered outside the error boundary-sensitive block.
  }
  if (!routeData) return <QuestionRouteFailure />;

  const { detail, evidenceOptions, questions } = routeData;
  if (detail.case.slug.toLocaleLowerCase() !== decodeURIComponent(slug).toLocaleLowerCase()) notFound();
  return <AdminAddQuestionPage caseItem={detail.case} evidences={evidenceOptions.evidences} nextSortOrder={Math.max(1, questions.total + 1)} />;
}

function loadQuestionRouteData(caseId: string, accessToken: string) {
  return Promise.all([
      getAdminCaseDetail(caseId, accessToken),
      getAdminQuestionEvidenceOptions(caseId, accessToken),
      getAdminCaseQuestions(caseId, accessToken),
  ]).then(([detail, evidenceOptions, questions]) => ({ detail, evidenceOptions, questions }));
}

function QuestionRouteFailure() {
  return <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><AdminDataError title="Form question gagal disiapkan." description="Detail case atau evidence options tidak dapat dimuat. Periksa koneksi API lalu coba lagi." /></div>;
}
