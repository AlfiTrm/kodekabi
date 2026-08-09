import { profileBadges } from "../data/profile";

const toneClasses = { red: "bg-red", green: "bg-green", orange: "bg-orange-shadow", purple: "bg-purple" } as const;

export function BadgeCollection() {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <div className="flex justify-between"><h2 className="text-xs font-bold">Lencana</h2><span className="font-mono text-[7px] text-foreground/25">4/12</span></div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {profileBadges.map((badge) => <div key={badge.id} title={badge.label} className={`grid aspect-square place-items-center rounded-xl border text-sm font-bold ${badge.unlocked ? `border-transparent text-white ${toneClasses[badge.tone]}` : "border-dashed border-border-strong bg-transparent text-foreground/25"}`}>{badge.symbol}</div>)}
      </div>
      <p className="mt-4 text-[8px] leading-relaxed text-foreground/30">Lencana berikutnya: pecahkan kasus tanpa salah klasifikasi.</p>
    </section>
  );
}

