import Image from "next/image";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { ShopItem } from "../../shop/types/shop";
import { ShopItemActionButton } from "../../shop/components/shop-item-action-button";

export function InventoryCollection({ items }: { items: ShopItem[] }) {
  console.log("[inventory-debug] InventoryCollection menerima items:", items);

  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3"><h2 className="text-xs font-bold">Inventory</h2><span className="font-mono text-[7px] uppercase text-foreground/25">{items.length} item dimiliki</span></div>
      {items.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => <article key={`${item.item_id}-${item.is_equipped ? "equipped" : "owned"}`} className={`flex items-center gap-3 rounded-xl border p-2.5 ${item.is_equipped ? "border-orange bg-orange/8" : "border-white/8 bg-background/30"}`}>
          <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-purple/15"><Image src={getTrustedImageUrl(item.image_url) ?? "/mascot/mascot-jacket.webp"} alt="" width={48} height={48} className="size-full object-contain" /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold">{item.name}</p><p className="mt-1 truncate font-mono text-[7px] uppercase text-foreground/35">{item.category_name || item.category_code}</p></div>
          <ShopItemActionButton initialItem={item} size="compact" />
        </article>)}
      </div> : <p className="mt-4 text-xs text-foreground/40">Belum ada item yang dimiliki.</p>}
    </section>
  );
}
