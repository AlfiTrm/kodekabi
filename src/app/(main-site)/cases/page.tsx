import { CasesPage } from "@/src/features/main-site/cases/containers/cases-page";
import type { CaseFilter } from "@/src/features/main-site/cases/types/case";

type CasesRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export default async function CasesRoute({ searchParams }: CasesRouteProps) {
  const params = await searchParams;
  const requestedTab = valueOf(params.tab, "all");
  const tab: CaseFilter = ["in_progress", "completed"].includes(requestedTab) ? requestedTab as CaseFilter : "all";
  const requestedPage = Number.parseInt(valueOf(params.page, "1"), 10);

  return <CasesPage tab={tab} page={Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1} />;
}
