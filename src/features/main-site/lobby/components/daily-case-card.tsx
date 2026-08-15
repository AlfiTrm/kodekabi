import Image from "next/image";
import Link from "next/link";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { UserCase } from "../../cases/types/case";

const difficultyLabels: Record<string, string> = { low: "mudah", medium: "sedang", high: "sulit" };

export function DailyCaseCard({ item }: { item: UserCase }) {
  const thumbnail = getTrustedImageUrl(item.thumbnail_url);
  const difficulty = difficultyLabels[item.difficulty_level] ?? item.difficulty_level;

  return (
    <article className="relative min-h-[340px] overflow-hidden rounded-[28px] bg-red p-6 text-white shadow-[0_20px_60px_rgba(242,109,109,0.16)] sm:p-8">
      {thumbnail ? <Image src={thumbnail} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(91,28,32,0.94)_0%,rgba(125,37,42,0.76)_52%,rgba(125,37,42,0.42)_100%)]" />

      <div className="relative z-10 max-w-full sm:max-w-[62%]">
        <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-bold text-button-ink">KASUS UNGGULAN</span>
        <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.1em] text-white/65">{difficulty} · {item.estimated_duration_minutes} menit</p>
        <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.04em] sm:text-5xl">
          {item.title}<span className="text-orange">.</span>
        </h2>
        <p className="mt-4 line-clamp-3 max-w-sm text-xs leading-relaxed text-white/80">{item.short_description}</p>
        <Link href={`/gameplay/start/${encodeURIComponent(item.case_id)}`} className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-7 text-xs font-bold text-button-ink transition-transform duration-200 hover:-translate-y-1">Main Sekarang</Link>
      </div>

      {item.minimum_level > 1 ? <span className="absolute right-6 top-6 z-10 rounded-full bg-background/75 px-3 py-1.5 text-[9px] font-bold">LV {item.minimum_level}</span> : null}
    </article>
  );
}
