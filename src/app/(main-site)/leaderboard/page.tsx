import { LeaderboardPage } from "@/src/features/main-site/leaderboard/containers/leaderboard-page";

type LeaderboardRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LeaderboardRoute({ searchParams }: LeaderboardRouteProps) {
  const params = await searchParams;
  const rawPage = typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  return <LeaderboardPage page={page} />;
}
