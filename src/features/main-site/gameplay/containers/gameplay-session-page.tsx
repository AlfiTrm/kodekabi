import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { isUserAccessToken } from "@/src/features/auth/login/utils/user-token";
import { ApiError } from "@/src/shared/services/api/api-error";

import { GameplayHeader } from "../components/gameplay-header";
import { GameplayWorkspace } from "../components/gameplay-workspace";
import { getGameplaySession } from "../services/user-gameplay-service";

export async function GameplaySessionPage({ sessionId }: { sessionId: string }) {
  const token = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!token || !isUserAccessToken(token)) redirect("/login");

  let result: Awaited<ReturnType<typeof getGameplaySession>> | null = null;
  let error: ApiError | null = null;
  try {
    result = await getGameplaySession(sessionId, token);
  } catch (caughtError) {
    result = null;
    error = caughtError instanceof ApiError ? caughtError : null;
  }

  if (!result) return <GameplayError error={error} />;

  return (
    <GameplayWorkspace sessionId={sessionId} initialData={result} />
  );
}

function GameplayError({ error }: { error: ApiError | null }) {
  return (
    <div className="min-h-screen bg-background">
      <GameplayHeader caseTitle="Session tidak ditemukan" />
      <main className="grid min-h-[70vh] place-items-center px-6 pt-16">
        <div className="max-w-md text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-red">Case file tidak terbaca</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase">Session gameplay gagal dimuat<span className="text-red">.</span></h1>
          <p className="mt-4 text-sm leading-relaxed text-foreground/50">Periksa session ID atau koneksi ke server, lalu coba buka kasusnya lagi.</p>
          {error ? <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-red/70">API {error.status}{error.code ? ` · ${error.code}` : ""}</p> : null}
          <Link href="/cases" className="mt-7 inline-flex h-11 items-center rounded-full border border-border-strong px-6 text-xs font-semibold transition-colors hover:border-foreground/40 hover:bg-surface">Kembali ke kasus</Link>
        </div>
      </main>
    </div>
  );
}
