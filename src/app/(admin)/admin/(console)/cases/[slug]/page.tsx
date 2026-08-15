import type { Metadata } from "next";

import { AdminCaseDetailPage } from "@/src/features/admin/cases/containers/admin-case-detail-page";

export const metadata: Metadata = {
  title: "Detail Case | KODEKABI Admin",
};

type AdminCaseDetailRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ caseId?: string | string[]; tab?: string | string[] }>;
};

export default async function AdminCaseDetailRoute({ params, searchParams }: AdminCaseDetailRouteProps) {
  const { slug } = await params;
  const query = await searchParams;
  const caseId = typeof query.caseId === "string" ? query.caseId : undefined;
  const activeTab = query.tab === "questions" ? "questions" : query.tab === "chatbot" ? "chatbot" : "evidence";

  return <AdminCaseDetailPage slug={slug} caseIdHint={caseId} activeTab={activeTab} />;
}
