import Image from "next/image";
import Link from "next/link";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { UserCase } from "../../cases/types/case";

const tones = ["bg-blue", "bg-green", "bg-orange-shadow", "bg-purple"];

export function CaseCatalogCard({ item, index }: { item: UserCase; index: number }) {
  const locked = item.access_status === "locked";
  const thumbnail = getTrustedImageUrl(item.thumbnail_url);
  const classes = `group relative flex min-h-52 overflow-hidden rounded-2xl border border-white/8 p-5 ${locked ? "cursor-not-allowed border-dashed opacity-55" : "transition-transform duration-200 hover:-translate-y-1"} ${tones[index % tones.length]}`;
  const content = (
    <>
      {thumbnail ? <Image src={thumbnail} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-background/10" />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/65">{item.difficulty_level} · {item.estimated_duration_minutes} mnt</p>
        <h3 className="mt-auto line-clamp-2 font-display text-xl font-bold uppercase leading-[0.95] tracking-[-0.03em] text-white">{item.title}</h3>
        <span className="mt-3 w-fit rounded-full bg-background/80 px-2.5 py-1 text-[8px] font-bold text-white">
          {locked ? item.locked_reason || `LV ${item.minimum_level}` : item.progress_status === "new" ? "BARU" : "TERSEDIA"}
        </span>
      </div>
    </>
  );

  if (locked) return <article className={classes}>{content}</article>;
  return <Link href="/cases" className={classes}>{content}</Link>;
}
