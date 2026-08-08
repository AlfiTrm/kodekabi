import { caseHistory } from "../data/profile";

const toneClasses = { red: "bg-red", green: "bg-green", blue: "bg-blue" } as const;

export function CaseHistory() {
  return (
    <section className="min-h-64 rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <div className="flex justify-between"><h2 className="text-xs font-bold">Riwayat kasus</h2><button type="button" className="text-[8px] text-purple">Semua →</button></div>
      <ul className="mt-4 divide-y divide-white/6">
        {caseHistory.map((item) => <li key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3"><span className={`size-2 rounded-sm ${toneClasses[item.tone]}`} /><div><p className="truncate text-[10px] font-semibold">{item.title}</p><p className="mt-1 font-mono text-[7px] uppercase text-foreground/30">{item.meta}</p></div><span className="rounded-full bg-foreground/6 px-2 py-1 text-[7px] text-foreground/55">{item.result}</span></li>)}
      </ul>
    </section>
  );
}

