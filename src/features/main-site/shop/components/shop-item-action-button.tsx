"use client";

import { useShopItemMutation } from "../hooks/use-shop-item-mutation";
import type { ShopItem } from "../types/shop";

export function ShopItemActionButton({ initialItem, size = "compact" }: { initialItem: ShopItem; size?: "compact" | "wide" }) {
  const { item, pending, message, purchase, equip } = useShopItemMutation(initialItem);
  const widthClass = size === "wide" ? "h-11 min-w-44 px-7 text-xs" : "h-8 px-4 text-[10px]";

  if (item.is_equipped) {
    return <span className={`inline-flex items-center justify-center rounded-full bg-orange font-bold text-button-ink ${widthClass}`}>Dipakai</span>;
  }

  if (item.can_equip) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button type="button" onClick={equip} disabled={pending} className={`cursor-pointer rounded-full bg-foreground font-bold text-button-ink transition-colors hover:bg-orange disabled:cursor-wait disabled:opacity-55 ${widthClass}`}>{pending ? "Memakai..." : "Pakai"}</button>
        {message ? <span role="alert" className="max-w-56 text-right text-[9px] text-red">{message}</span> : null}
      </div>
    );
  }

  if (item.can_purchase) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button type="button" onClick={purchase} disabled={pending} className={`cursor-pointer rounded-full bg-foreground font-bold text-button-ink transition-colors hover:bg-orange disabled:cursor-wait disabled:opacity-55 ${widthClass}`}>{pending ? "Membeli..." : "Beli"}</button>
        {message ? <span role="alert" className="max-w-56 text-right text-[9px] text-red">{message}</span> : null}
      </div>
    );
  }

  return <span className={`inline-flex items-center justify-center rounded-full border border-border-strong font-bold text-foreground/40 ${widthClass}`}>Dimiliki</span>;
}
