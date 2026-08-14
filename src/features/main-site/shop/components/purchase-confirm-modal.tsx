"use client";

import Image from "next/image";

import { ConfirmationModal } from "@/src/shared/components/ui/confirmation-modal";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { ShopItem } from "../types/shop";

type PurchaseConfirmModalProps = {
  item: ShopItem;
  coinBalance?: number;
  pending: boolean;
  message: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function PurchaseConfirmModal({ item, coinBalance, pending, message, onClose, onConfirm }: PurchaseConfirmModalProps) {
  const imageUrl = getTrustedImageUrl(item.image_url) ?? "/mascot/mascot-jacket.webp";
  const insufficientBalance = coinBalance !== undefined && coinBalance < item.price_coin;

  return (
    <ConfirmationModal
      labelledBy="purchase-confirm-title"
      title="Konfirmasi Pembelian."
      onClose={onClose}
      showCloseButton
      closeDisabled={pending}
      footer={(
        <>
          <button type="button" onClick={onClose} disabled={pending} className="inline-flex h-10 min-w-20 cursor-pointer items-center justify-center rounded-full border border-border-strong px-5 text-xs font-semibold text-foreground/55 transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-wait disabled:opacity-50">
            Batalkan
          </button>
          <button type="button" onClick={onConfirm} disabled={pending || insufficientBalance} className="inline-flex h-10 min-w-32 cursor-pointer items-center justify-center rounded-full bg-foreground px-5 text-xs font-bold text-button-ink transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35">
            {pending ? "Membeli..." : insufficientBalance ? "Koin Kurang" : "Konfirmasi Beli"}
          </button>
        </>
      )}
    >
      <div className="overflow-hidden rounded-xl border border-white/8 bg-surface-muted">
        <div className="flex items-center gap-4 p-4">
          <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-purple/12 p-2">
            <Image src={imageUrl} alt={item.name} width={80} height={80} className="size-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-purple">{item.category_name || "Item"}</p>
            <p className="mt-1 truncate font-display text-xl font-bold">{item.name}</p>
          </div>
        </div>
        <dl className="space-y-2 border-t border-white/8 px-4 py-3 text-[10px]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-foreground/45">Harga</dt>
            <dd className="font-mono font-bold text-foreground">- {item.price_coin.toLocaleString("id-ID")} Koin</dd>
          </div>
          {coinBalance !== undefined ? (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-foreground/45">Saldo Saat Ini</dt>
              <dd className="font-mono font-bold text-foreground/65">{coinBalance.toLocaleString("id-ID")} Koin</dd>
            </div>
          ) : null}
        </dl>
      </div>
      {message ? <p role="alert" className="mt-3 rounded-lg border border-red/25 bg-red/8 px-3 py-2 text-[10px] text-red">{message}</p> : null}
    </ConfirmationModal>
  );
}
