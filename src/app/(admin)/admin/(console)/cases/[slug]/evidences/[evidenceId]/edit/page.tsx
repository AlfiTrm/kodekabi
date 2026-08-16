import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminEditEvidencePage } from "@/src/features/admin/cases/containers/admin-edit-evidence-page";
import { getAdminCaseDetail, getAdminCaseEvidenceDetail, resolveAdminCaseId } from "@/src/features/admin/cases/services/admin-cases-service";

export const metadata: Metadata = { title: "Edit Evidence | KODEKABI Admin" };

type EditEvidenceRouteProps = {
  params: Promise<{ slug: string; evidenceId: string }>;
  searchParams: Promise<{ caseId?: string | string[]; versionId?: string | string[] }>;
};

export default async function EditEvidenceRoute({ params, searchParams }: EditEvidenceRouteProps) {
  const { slug, evidenceId } = await params;
  const query = await searchParams;
  const caseIdHint = typeof query.caseId === "string" ? query.caseId : undefined;
  const versionIdHint = typeof query.versionId === "string" ? query.versionId : undefined;
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  const result = await loadEditEvidence(slug, evidenceId, caseIdHint, versionIdHint, accessToken);
  if (!result) {
    return <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><AdminDataError title="Evidence gagal dimuat." description="Detail evidence tidak tersedia atau koneksi API sedang bermasalah." /></div>;
  }

  if (result.caseItem.slug.toLocaleLowerCase() !== decodeURIComponent(slug).toLocaleLowerCase()) notFound();
  return <AdminEditEvidencePage caseItem={result.caseItem} evidence={result.evidence} rawResponse={result.rawResponse} />;
}

async function loadEditEvidence(slug: string, evidenceId: string, caseIdHint: string | undefined, versionIdHint: string | undefined, accessToken: string) {
  try {
    const caseId = await resolveAdminCaseId(slug, accessToken, caseIdHint);
    if (!caseId) return null;

    const caseDetail = await getAdminCaseDetail(caseId, accessToken);
    const versionId = versionIdHint || caseDetail.case.current_case_version_id;
    const evidenceDetail = await getAdminCaseEvidenceDetail(caseId, versionId, evidenceId, accessToken);
    console.log("[getAdminCaseEvidenceDetail]", JSON.stringify(evidenceDetail, null, 2));
    return { caseItem: caseDetail.case, evidence: evidenceDetail.evidence, rawResponse: evidenceDetail };
  } catch {
    return null;
  }
}
