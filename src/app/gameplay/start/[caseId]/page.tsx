import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { isUserAccessToken } from "@/src/features/auth/login/utils/user-token";
import { GameplayHeader } from "@/src/features/main-site/gameplay/components/gameplay-header";
import { startGameplaySession } from "@/src/features/main-site/gameplay/services/start-gameplay-session-service";

type StartGameplayRouteProps = {
  params: Promise<{ caseId: string }>;
};

function StartGameplayError() {
  return (
    <div className="min-h-screen bg-background">
      <GameplayHeader caseTitle="Session tidak tersedia" />
      <main className="grid min-h-[70vh] place-items-center px-6">
        <div className="max-w-md text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-orange">Case file belum bisa dibuka</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase">Gagal memulai investigasi<span className="text-orange">.</span></h1>
          <p className="mt-4 text-sm leading-relaxed text-foreground/50">Kasus mungkin terkunci, sudah punya sesi aktif, atau server belum bisa membuat session baru.</p>
          <Link href="/cases" className="mt-7 inline-flex h-11 items-center rounded-full border border-border-strong px-6 text-xs font-semibold transition-colors hover:border-foreground/40 hover:bg-surface">Kembali ke kasus</Link>
        </div>
      </main>
    </div>
  );
}

export default async function StartGameplayRoute({ params }: StartGameplayRouteProps) {
  const { caseId } = await params;
  const token = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!token || !isUserAccessToken(token)) redirect("/login");

  let result: Awaited<ReturnType<typeof startGameplaySession>> | null = null;
  try {
    result = await startGameplaySession(caseId, token);
  } catch (error) {
    console.error("[gameplay] start route failed", { caseId, error });
    result = null;
  }

  if (!result?.session?.case_session_id) return <StartGameplayError />;

  redirect(`/gameplay/${encodeURIComponent(result.session.case_session_id)}`);
}
