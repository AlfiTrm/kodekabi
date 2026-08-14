"use client";

import Image from "next/image";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import { useRedeemPurchase } from "../hooks/use-redeem-purchase";
import type { RedeemItem } from "../types/redeem";
import { RedeemPurchaseModal } from "./redeem-purchase-modal";
import { RedeemSuccessModal } from "./redeem-success-modal";

const periodLabels: Record<string, string> = {
  daily: "hari",
  weekly: "minggu",
  monthly: "bulan",
  once: "akun",
};

export function RedeemItemCard({ initialItem, coinBalance, priority = false }: { initialItem: RedeemItem; coinBalance: number; priority?: boolean }) {
  const mutation = useRedeemPurchase(initialItem, coinBalance);
  const { item } = mutation;
  const imageUrl = getTrustedImageUrl(item.image_url) ?? "/mascot/mascot-jacket.webp";
  const owned = item.user_claim_count > 0;
  const soldOut = item.is_stock_visible && item.stock_remaining <= 0;
  const period = periodLabels[item.claim_period] ?? item.claim_period;

  let action: React.ReactNode;
  if (owned) {
    action = <span className="inline-flex h-8 min-w-28 items-center justify-center rounded-full border border-green/20 bg-green/8 px-4 text-[10px] font-bold text-green">Sudah dibeli</span>;
  } else if (soldOut) {
    action = <span className="inline-flex h-8 min-w-28 items-center justify-center rounded-full bg-red/8 px-4 text-[10px] font-bold text-red">Habis</span>;
  } else if (!item.can_purchase) {
    action = <span className="inline-flex h-8 min-w-28 items-center justify-center rounded-full bg-surface-muted px-4 text-[10px] font-bold text-foreground/35">Tidak tersedia</span>;
  } else {
    action = <button type="button" onClick={mutation.openConfirmation} className="h-8 min-w-28 cursor-pointer rounded-full bg-foreground px-4 text-[10px] font-bold text-button-ink transition-colors hover:bg-orange">Beli</button>;
  }

  return (
    <article className="group grid min-h-32 grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-border-strong bg-surface p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-purple/35 sm:grid-cols-[6rem_minmax(0,1fr)_auto]">
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-muted p-2 sm:size-24">
        <Image src={imageUrl} alt={item.name} width={96} height={96} priority={priority} className="size-full object-contain transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex-1 self-stretch py-1">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-foreground/40">{item.partner_name || item.type_name}</p>
        <h2 className="mt-1 line-clamp-1 font-display text-lg font-bold tracking-[-0.02em] sm:text-xl">{item.name}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-wide">
          <span className="rounded-full bg-orange/10 px-2.5 py-1 text-orange">Maks. {item.max_claim_per_period}x/{period}</span>
          {item.is_stock_visible ? <span className="rounded-full bg-white/4 px-2.5 py-1 text-foreground/40">Stok: {item.stock_remaining}</span> : null}
        </div>
      </div>
      <div className="col-span-2 flex shrink-0 items-center justify-between gap-4 self-stretch py-1 sm:col-span-1 sm:flex-col sm:items-end">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/8 px-3 py-1.5 font-mono text-[10px] font-bold text-orange"><span className="size-3 rounded-full bg-orange" />{item.price_coin.toLocaleString("id-ID")} Koin</span>
        {action}
      </div>

      {mutation.confirmationOpen ? <RedeemPurchaseModal item={item} coinBalance={mutation.coinBalance} pending={mutation.pending} message={mutation.message} onClose={mutation.closeConfirmation} onConfirm={mutation.purchase} /> : null}
      {mutation.redeemCode ? <RedeemSuccessModal item={item} code={mutation.redeemCode} coinBalance={mutation.coinBalance} onClose={mutation.closeSuccess} /> : null}
    </article>
  );
}
