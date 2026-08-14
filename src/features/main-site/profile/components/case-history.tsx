import type { UserCaseHistoryItem } from "../types/profile";

function formatCompletedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(date);
}

export function CaseHistory({ items }: { items: UserCaseHistoryItem[] }) {
  return (
    <section className="min-h-64 rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <h2 className="text-xs font-bold">Riwayat kasus</h2>
      {items.length ? <ul className="mt-4 divide-y divide-white/6">
        {items.map((item) => <li key={`${item.case_id}-${item.completed_at}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3"><span className="size-2 rounded-sm bg-green" /><div><p className="truncate text-[10px] font-semibold">{item.title}</p><p className="mt-1 font-mono text-[7px] uppercase text-foreground/35">{formatCompletedAt(item.completed_at)} · {item.difficulty_label} · +{item.xp_reward} XP</p></div><div className="text-right"><span className="rounded-full bg-green/10 px-2 py-1 text-[7px] text-green">{item.result_status}</span><p className="mt-2 text-[7px] text-foreground/35">{item.score_label}</p></div></li>)}
      </ul> : <div className="grid min-h-44 place-items-center text-center"><div><p className="text-sm font-semibold">Belum ada kasus selesai.</p><p className="mt-2 text-xs text-foreground/40">Riwayat investigasimu akan tercatat di sini.</p></div></div>}
    </section>
  );
}
