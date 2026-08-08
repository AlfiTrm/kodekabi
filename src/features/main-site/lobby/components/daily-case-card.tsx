import Link from "next/link";

import { SocialEvidencePreview } from "./social-evidence-preview";

export function DailyCaseCard() {
  return (
    <article className="relative min-h-[340px] overflow-hidden rounded-[28px] bg-red p-6 text-white shadow-[0_20px_60px_rgba(242,109,109,0.16)] sm:p-8">
      <div className="relative z-10 max-w-full sm:max-w-[58%]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-bold text-button-ink">DAILY CASE · 09:12:44</span>
        </div>
        <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.1em] text-button-ink/65">Social post · risiko sedang · mengancam: wellbeing</p>
        <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.86] tracking-[-0.045em] sm:text-5xl">
          Vitamin<br />Ajaib Viral<span className="text-button-ink">.</span>
        </h2>
        <p className="mt-4 max-w-sm text-[10px] leading-relaxed text-white/85 sm:text-xs">
          Klaim “sembuh 27 penyakit” menyebar 3.100× sehari. Puskesmas kewalahan.
        </p>
        <Link href="/cases" className="mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-white px-7 text-xs font-bold text-button-ink transition-transform duration-200 hover:-translate-y-1">
          <span aria-hidden="true">▶</span>
          Main Sekarang
        </Link>
      </div>

      <span className="absolute right-6 top-6 z-10 rounded-full bg-red-shadow px-3 py-1.5 text-[9px] font-bold">2× XP</span>
      <SocialEvidencePreview />
    </article>
  );
}
