import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";

import { LobbyCaseSection } from "../components/lobby-case-section";
import { LobbyHero } from "../components/lobby-hero";
import { getUserLobby } from "../services/user-lobby-service";
import type { CityStat, CityStatTone } from "../types/city-stat";
import type { LobbyCityStat } from "../types/lobby";

const cityStatLabels: Record<string, string> = {
  health: "INFO HEALTH",
  stability: "STABILITY",
  trust: "TRUST",
  wellbeing: "WELLBEING",
};

function getJakartaCityState() {
  const now = new Date();
  const hour = Number(new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(now));
  const date = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Jakarta",
    weekday: "long",
  }).format(now);

  if (hour >= 5 && hour < 18) {
    return { timeLabel: `${date} · pagi hari`, videoSource: "/video/video-town-morning.webm", videoType: "video/webm" as const };
  }

  return { timeLabel: `${date} · malam hari`, videoSource: "/video/video-town.webm", videoType: "video/webm" as const };
}

function mapCityStat(stat: LobbyCityStat): CityStat {
  const delta = Number(stat.delta) || 0;
  const safeValue = Math.min(100, Math.max(0, Number(stat.value) || 0));
  const tone: CityStatTone = stat.status.toLowerCase() === "aman" ? "green" : "red";

  return {
    id: stat.key,
    label: cityStatLabels[stat.key] ?? stat.label,
    value: safeValue,
    delta: delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : "— stabil",
    tone,
  };
}

export async function LobbyPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  const lobby = await getUserLobby(accessToken).catch(() => null);
  if (!lobby) {
    return (
      <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-background px-5">
        <div className="max-w-md rounded-3xl border border-red/30 bg-red/5 px-7 py-10 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">Kota gagal dimuat.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Periksa koneksi atau sesi akunmu, lalu coba buka kembali lobby.</p>
          <Link href="/lobby" className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-xs font-bold text-background">Muat ulang</Link>
        </div>
      </main>
    );
  }

  const cityState = getJakartaCityState();
  return (
    <main className="flex-1 bg-background">
      <LobbyHero cityStats={lobby.city_stats.map(mapCityStat)} {...cityState} />
      <LobbyCaseSection featuredCase={lobby.featured_case} continueCase={lobby.continue_case} otherCases={lobby.other_cases} />
    </main>
  );
}
