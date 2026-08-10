import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminAddEvidencePage } from "@/src/features/admin/cases/containers/admin-add-evidence-page";
import { getAdminCaseDetail, resolveAdminCaseId } from "@/src/features/admin/cases/services/admin-cases-service";

export const metadata: Metadata = { title: "Tambah Evidence | KODEKABI Admin" };

type AddEvidenceRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ caseId?: string | string[] }>;
};

export default async function AddEvidenceRoute({ params, searchParams }: AddEvidenceRouteProps) {
  const { slug } = await params;
  const query = await searchParams;
  const caseIdHint = typeof query.caseId === "string" ? query.caseId : undefined;
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let caseId: string | null = null;
  let detailResult: Awaited<ReturnType<typeof getAdminCaseDetail>> | null = null;

  try {
    caseId = await resolveAdminCaseId(slug, accessToken, caseIdHint);
    if (caseId) detailResult = await getAdminCaseDetail(caseId, accessToken);
  } catch {
    return <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><AdminDataError title="Form evidence gagal disiapkan." description="Detail case tidak dapat dimuat. Periksa koneksi API lalu coba lagi." /></div>;
  }

  if (!caseId || !detailResult) notFound();
  const caseItem = detailResult.case;
  if (caseItem.slug.toLocaleLowerCase() !== decodeURIComponent(slug).toLocaleLowerCase()) notFound();
  if (caseItem.evidence_count >= 5) redirect(`/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}#workspace`);

  return <AdminAddEvidencePage caseItem={caseItem} />;
}
