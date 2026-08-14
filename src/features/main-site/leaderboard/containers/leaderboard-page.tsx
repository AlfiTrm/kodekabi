import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { LeaderboardBoard } from "../components/leaderboard-board";
import { LeaderboardFilter } from "../components/leaderboard-filter";
import { getUserLeaderboard } from "../services/user-leaderboard-service";
import type { LeaderboardApiEntry, LeaderboardEntry, LeaderboardPagination } from "../types/leaderboard";

const tones: LeaderboardEntry["tone"][] = ["purple", "blue", "orange", "green", "red"];

function toEntry(entry: LeaderboardApiEntry): LeaderboardEntry {
  return {
    rank: entry.rank,
    username: entry.username || "Auditor tanpa nama",
    initial: entry.username?.trim().charAt(0).toUpperCase() || "?",
    level: entry.level,
    points: entry.score,
    tone: entry.rank <= 3 ? tones[entry.rank - 1] : tones[Math.abs(entry.rank) % tones.length],
    currentUser: entry.is_current_user,
    avatarUrl: entry.avatar_url,
  };
}

export async function LeaderboardPage({ page }: { page: number }) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  const result = await getUserLeaderboard(page, 10, accessToken).catch(() => null);
  if (!result) {
    return (
      <LeaderboardShell>
        <div className="mt-16 rounded-2xl border border-red/25 bg-red/8 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-red">Peringkat gagal dimuat.</p>
          <p className="mt-2 text-xs text-foreground/50">Periksa koneksi lalu coba lagi.</p>
          <Link href="/leaderboard" className="mt-5 inline-flex rounded-full border border-red/30 px-5 py-2 text-xs font-semibold text-red hover:bg-red/10">Muat ulang</Link>
        </div>
      </LeaderboardShell>
    );
  }

  const entries = result.entries.map(toEntry);
  const podiumEntries = entries.filter((entry) => entry.rank <= 3).sort((a, b) => a.rank - b.rank);
  const rankedEntries = entries.filter((entry) => entry.rank > 3 && !entry.currentUser);
  const currentUser = result.me && result.me.rank > 3 ? toEntry(result.me) : undefined;

  return (
    <LeaderboardShell>
      <section className="mt-16 sm:mt-20" aria-label="Peringkat global">
        <LeaderboardBoard podiumEntries={podiumEntries} rankedEntries={rankedEntries} currentUser={currentUser} />
      </section>
      <LeaderboardPagination pagination={result.pagination} />
      {currentUser ? (
        <p className="mt-7 text-center text-[10px] text-foreground/35">
          {currentUser.rank > 3 ? `${currentUser.rank - 3} peringkat lagi menuju podium.` : "Kamu sudah berada di podium."}
        </p>
      ) : null}
    </LeaderboardShell>
  );
}

function LeaderboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex-1 bg-background pb-16 pt-28 sm:pt-32">
      <SiteContainer>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-[-0.04em] sm:text-6xl">
              Top Auditor<span className="text-purple">.</span>
            </h1>
            <LeaderboardFilter />
          </div>
          {children}
        </div>
      </SiteContainer>
    </main>
  );
}

function LeaderboardPagination({ pagination }: { pagination: LeaderboardPagination }) {
  if (pagination.total_pages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Halaman peringkat">
      {pagination.page > 1 ? <Link href={`/leaderboard?page=${pagination.page - 1}`} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/60 hover:text-foreground">Sebelumnya</Link> : null}
      <span className="px-2 font-mono text-[10px] text-foreground/45">{pagination.page} / {pagination.total_pages}</span>
      {pagination.page < pagination.total_pages ? <Link href={`/leaderboard?page=${pagination.page + 1}`} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/60 hover:text-foreground">Berikutnya</Link> : null}
    </nav>
  );
}
