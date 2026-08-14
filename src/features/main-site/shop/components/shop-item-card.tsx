import Image from "next/image";
import Link from "next/link";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { ShopItem } from "../types/shop";
import { ShopItemActionButton } from "./shop-item-action-button";

export function ShopItemCard({ item, priority = false }: { item: ShopItem; priority?: boolean }) {
  const imageUrl = getTrustedImageUrl(item.image_url) ?? "/mascot/mascot-jacket.webp";

  return (
    <article className={`group flex min-h-72 flex-col overflow-hidden rounded-2xl border bg-surface transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-orange/45 hover:shadow-[0_18px_46px_rgba(0,0,0,0.3)] ${item.is_equipped ? "border-orange bg-orange/8" : "border-white/8"}`}>
      <Link href={`/shop/${encodeURIComponent(item.item_id)}`} className="relative flex min-h-44 items-end justify-center overflow-hidden bg-purple/15 px-5 pt-5" aria-label={`Lihat detail ${item.name}`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(135,112,255,0.26),transparent_58%)]" aria-hidden="true" />
        <Image src={imageUrl} alt={item.name} width={220} height={190} priority={priority} className="relative h-40 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-purple">{item.category_name || "Item"}</p>
        <Link href={`/shop/${encodeURIComponent(item.item_id)}`} className="mt-1 line-clamp-1 font-display text-xl font-bold uppercase leading-none tracking-[-0.02em] hover:text-orange">{item.name}</Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-orange/35 bg-orange/10 px-3 font-mono text-[10px] font-bold text-orange">
            <span className="size-3 rounded-full bg-orange shadow-[inset_0_-2px_0_var(--orange-shadow)]" aria-hidden="true" />
            {item.price_coin === 0 ? "Gratis" : `${item.price_coin.toLocaleString("id-ID")} Koin`}
          </span>
          <ShopItemActionButton initialItem={item} />
        </div>
      </div>
    </article>
  );
}
