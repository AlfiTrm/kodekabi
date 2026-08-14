import type { UserProfileStat } from "../types/profile";

const toneClasses = ["bg-blue", "bg-purple", "bg-orange-shadow", "bg-red", "bg-green"] as const;

export function DetectiveStatistics({ stats }: { stats: UserProfileStat[] }) {
  const average = stats.length ? Math.round(stats.reduce((total, stat) => total + stat.score, 0) / stats.length) : 0;

  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between"><h2 className="text-xs font-bold">Statistik detektif</h2><span className="font-mono text-[7px] uppercase text-foreground/35">rata-rata {average}</span></div>
      {stats.length ? <div className="mt-5 space-y-3">
        {stats.map((stat, index) => {
          const score = Math.min(100, Math.max(0, Number(stat.score) || 0));
          return <div key={stat.key} className="grid grid-cols-[minmax(0,1fr)_minmax(90px,1fr)_2rem] items-center gap-3 text-[8px] sm:text-[9px]">
            <span className="truncate text-foreground/55">{stat.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-foreground/10"><span className={`block h-full rounded-full ${toneClasses[index % toneClasses.length]}`} style={{ width: `${score}%` }} /></span>
            <strong className="text-right">{score}</strong>
          </div>;
        })}
      </div> : <p className="mt-5 text-sm text-foreground/40">Statistik akan muncul setelah kasus pertamamu selesai.</p>}
    </section>
  );
}
