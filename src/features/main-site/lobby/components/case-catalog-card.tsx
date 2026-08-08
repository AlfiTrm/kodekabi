import Link from "next/link";

import type { LobbyCase } from "../types/lobby-case";

const toneClasses: Record<LobbyCase["tone"], string> = {
  blue: "border-blue bg-blue",
  green: "border-green bg-green",
  orange: "border-orange-shadow bg-orange-shadow",
  locked: "border-dashed border-border-strong bg-surface text-foreground/35",
};

type CaseCatalogCardProps = {
  item: LobbyCase;
};

export function CaseCatalogCard({ item }: CaseCatalogCardProps) {
  const content = (
    <>
      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-button-ink/60">{item.eyebrow}</p>
      <h3 className={`mt-3 font-display text-xl font-bold uppercase leading-[0.92] tracking-[-0.035em] ${item.locked ? "text-foreground/35" : "text-white"}`}>{item.title}</h3>
      <span className={`mt-auto w-fit rounded-full px-2.5 py-1 text-[8px] font-bold ${item.locked ? "bg-surface-muted text-foreground/40" : "bg-white text-button-ink"}`}>
        {item.locked ? "🔒 LV 8" : `+${item.xp} XP`}
      </span>
    </>
  );

  const classes = `flex min-h-48 flex-col rounded-2xl border p-5 transition-transform duration-200 ${toneClasses[item.tone]} ${item.locked ? "cursor-not-allowed" : "hover:-translate-y-1"}`;

  if (item.locked) return <article className={classes}>{content}</article>;
  return <Link href="/cases" className={classes}>{content}</Link>;
}
