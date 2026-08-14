"use client";

import { useShopItemMutation } from "../hooks/use-shop-item-mutation";
import type { ShopItem } from "../types/shop";
import { PurchaseConfirmModal } from "./purchase-confirm-modal";
import { PurchaseSuccessModal } from "./purchase-success-modal";

export function ShopItemActionButton({ initialItem, size = "compact", coinBalance }: { initialItem: ShopItem; size?: "compact" | "wide" | "full"; coinBalance?: number }) {
  const {
    item,
    pending,
    message,
    purchaseConfirmationOpen,
    openPurchaseConfirmation,
    closePurchaseConfirmation,
    purchaseSuccessOpen,
    closePurchaseSuccess,
    finishPurchase,
    purchase,
    equip,
  } = useShopItemMutation(initialItem);
  const widthClass = size === "full"
    ? "h-12 w-full px-7 text-xs"
    : size === "wide"
      ? "h-11 min-w-44 px-7 text-xs"
      : "h-8 px-4 text-[10px]";
  const wrapperClass = size === "full" ? "flex w-full flex-col gap-1" : "flex flex-col items-end gap-1";

  let action: React.ReactNode;

  if (item.is_equipped) {
    action = <span className={`inline-flex items-center justify-center rounded-full bg-orange font-bold text-button-ink ${widthClass}`}>Dipakai</span>;
  } else if (item.can_equip) {
    action = (
      <div className={wrapperClass}>
        <button type="button" onClick={equip} disabled={pending} className={`cursor-pointer rounded-full bg-foreground font-bold text-button-ink transition-colors hover:bg-orange disabled:cursor-wait disabled:opacity-55 ${widthClass}`}>{pending ? "Memakai..." : "Pakai"}</button>
        {message ? <span role="alert" className="max-w-56 text-right text-[9px] text-red">{message}</span> : null}
      </div>
    );
  } else if (item.can_purchase) {
    action = (
      <div className={wrapperClass}>
        <button type="button" onClick={openPurchaseConfirmation} disabled={pending} className={`cursor-pointer rounded-full bg-foreground font-bold text-button-ink transition-colors hover:bg-orange disabled:cursor-wait disabled:opacity-55 ${widthClass}`}>Beli</button>
        {message ? <span role="alert" className="max-w-56 text-right text-[9px] text-red">{message}</span> : null}
      </div>
    );
  } else {
    action = <span className={`inline-flex items-center justify-center rounded-full border border-border-strong font-bold text-foreground/40 ${widthClass}`}>Dimiliki</span>;
  }

  return (
    <>
      {action}
      {purchaseConfirmationOpen ? <PurchaseConfirmModal item={item} coinBalance={coinBalance} pending={pending} message={message} onClose={closePurchaseConfirmation} onConfirm={purchase} /> : null}
      {purchaseSuccessOpen ? <PurchaseSuccessModal item={item} coinBalance={coinBalance} onClose={closePurchaseSuccess} onReturnToShop={finishPurchase} /> : null}
    </>
  );
}
