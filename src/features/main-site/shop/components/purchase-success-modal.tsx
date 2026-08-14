"use client";

import Image from "next/image";

import { ConfirmationModal } from "@/src/shared/components/ui/confirmation-modal";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { ShopItem } from "../types/shop";

type PurchaseSuccessModalProps = {
  item: ShopItem;
  coinBalance?: number;
  onClose: () => void;
  onReturnToShop: () => void;
};

export function PurchaseSuccessModal({ item, coinBalance, onClose, onReturnToShop }: PurchaseSuccessModalProps) {
  const imageUrl = getTrustedImageUrl(item.image_url) ?? "/mascot/mascot-jacket.webp";
  const remainingBalance = coinBalance === undefined ? undefined : Math.max(0, coinBalance - item.price_coin);

  return (
    <ConfirmationModal
      labelledBy="purchase-success-title"
      title="Pembelian Berhasil."
      onClose={onClose}
      showCloseButton
      className="max-w-[620px]"
      leading={(
        <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-green text-sm font-bold text-green" aria-hidden="true">
          &#10003;
        </span>
      )}
      footer={(
        <button type="button" onClick={onReturnToShop} className="inline-flex h-12 min-w-48 cursor-pointer items-center justify-center rounded-full bg-green px-7 text-xs font-bold text-button-ink transition-colors hover:bg-green/85">
          Kembali ke Shop
        </button>
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface-muted">
        <div className="flex items-center gap-5 p-5 sm:p-7">
          <div className="grid size-24 shrink-0 place-items-center rounded-xl bg-purple/12 p-2">
            <Image src={imageUrl} alt={item.name} width={96} height={96} className="size-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-purple">{item.category_name || "Item"} Baru</p>
            <p className="mt-1 truncate font-display text-2xl font-bold uppercase">{item.name}</p>
          </div>
        </div>
        <dl className="border-t border-white/8 px-5 py-4 text-xs sm:px-7">
          <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
            <dt className="text-foreground/50">Status Pembayaran</dt>
            <dd className="font-bold text-green">Berhasil</dd>
          </div>
          {remainingBalance !== undefined ? (
            <div className="flex items-center justify-between gap-4 pt-4">
              <dt className="font-semibold text-foreground">Saldo Saat Ini</dt>
              <dd className="flex items-center gap-2 font-mono font-bold text-orange">
                <span className="size-4 rounded-full bg-orange shadow-[inset_0_-3px_0_var(--orange-shadow)]" aria-hidden="true" />
                {remainingBalance.toLocaleString("id-ID")}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </ConfirmationModal>
  );
}
