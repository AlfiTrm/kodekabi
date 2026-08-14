import { RedeemPage } from "@/src/features/main-site/redeem/containers/redeem-page";
import type { RedeemFilter } from "@/src/features/main-site/redeem/types/redeem";

type RedeemRouteProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function valueOf(value: string | string[] | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export default async function RedeemRoute({ searchParams }: RedeemRouteProps) {
  const params = await searchParams;
  const requestedFilter = valueOf(params.filter, "all");
  const filter: RedeemFilter = requestedFilter === "owned" ? "owned" : "all";
  const requestedPage = Number.parseInt(valueOf(params.page, "1"), 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return <RedeemPage search={valueOf(params.search).slice(0, 100)} filter={filter} page={page} />;
}
