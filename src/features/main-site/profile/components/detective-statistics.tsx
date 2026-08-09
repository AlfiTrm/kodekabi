import { detectiveSkills } from "../data/profile";

const toneClasses = { blue: "bg-blue", purple: "bg-purple", orange: "bg-orange-shadow", red: "bg-red", green: "bg-green" } as const;

export function DetectiveStatistics() {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between"><h2 className="text-xs font-bold">Statistik detektif</h2><span className="font-mono text-[7px] uppercase text-foreground/25">rata-rata 74</span></div>
      <div className="mt-5 space-y-3">
        {detectiveSkills.map((skill) => (
          <div key={skill.label} className="grid grid-cols-[minmax(0,1fr)_minmax(90px,1fr)_2rem] items-center gap-3 text-[8px] sm:text-[9px]">
            <span className="truncate text-foreground/55">{skill.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-foreground/10"><span className={`block h-full rounded-full ${toneClasses[skill.tone]}`} style={{ width: `${skill.value}%` }} /></span>
            <strong className="text-right">{skill.value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-green/15 px-3 py-1 text-[7px] font-bold text-green">✓ JAGOAN: SAFETY</span><span className="rounded-full bg-orange/10 px-3 py-1 text-[7px] font-bold text-orange">→ LATIH: CONFIDENCE</span></div>
    </section>
  );
}

