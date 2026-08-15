import Image from "next/image";
import Link from "next/link";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { UserCase } from "../../cases/types/case";

export function ContinuationCaseCard({ item }: { item: UserCase }) {
  const thumbnail = getTrustedImageUrl(item.thumbnail_url);

  return (
    <article className="relative flex min-h-[340px] flex-col overflow-hidden rounded-[28px] bg-purple p-6 text-white shadow-[0_20px_60px_rgba(131,117,232,0.15)] sm:p-7">
      {thumbnail ? <Image src={thumbnail} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,35,104,0.52)_0%,rgba(35,28,85,0.94)_100%)]" />
      <div className="relative z-10 flex h-full flex-1 flex-col">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/65">Kasus berjalan</p>
        <h2 className="mt-4 text-balance font-display text-3xl font-bold uppercase leading-none tracking-[-0.035em]">{item.title}</h2>
        <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-white/70">{item.short_description}</p>
        <Link href={`/gameplay/start/${encodeURIComponent(item.case_id)}`} className="mt-auto inline-flex h-12 w-fit items-center rounded-full bg-white px-7 text-xs font-bold text-button-ink transition-transform duration-200 hover:-translate-y-1">Lanjutkan</Link>
      </div>
    </article>
  );
}
