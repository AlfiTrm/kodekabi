"use client";

import Image from "next/image";

import { ConfirmationModal } from "@/src/shared/components/ui/confirmation-modal";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { RedeemItem } from "../types/redeem";

export function RedeemPurchaseModal({ item, coinBalance, pending, message, onClose, onConfirm }: { item: RedeemItem; coinBalance: number; pending: boolean; message: string | null; onClose: () => void; onConfirm: () => void }) {
  const insufficient = coinBalance < item.price_coin;
  const imageUrl = getTrustedImageUrl(item.image_url) ?? "/mascot/mascot-jacket.webp";

  return (
    <ConfirmationModal
      labelledBy="redeem-purchase-title"
      title="Konfirmasi Redeem."
      description="Kode reward langsung diberikan setelah transaksi berhasil."
      onClose={onClose}
      showCloseButton
      closeDisabled={pending}
      footer={(
        <>
          <button type="button" onClick={onClose} disabled={pending} className="h-10 cursor-pointer rounded-full border border-border-strong px-5 text-xs font-semibold text-foreground/55 hover:text-foreground disabled:cursor-wait disabled:opacity-50">Batalkan</button>
          <button type="button" onClick={onConfirm} disabled={pending || insufficient} className="h-10 min-w-36 cursor-pointer rounded-full bg-foreground px-5 text-xs font-bold text-button-ink transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35">{pending ? "Memproses..." : insufficient ? "Koin Kurang" : "Konfirmasi Beli"}</button>
        </>
      )}
    >
      <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-surface-muted p-4">
        <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-background p-2"><Image src={imageUrl} alt="" width={80} height={80} className="size-full object-contain" /></div>
        <div className="min-w-0 flex-1"><p className="font-mono text-[8px] uppercase tracking-wider text-purple">{item.partner_name || item.type_name}</p><p className="mt-1 truncate font-display text-xl font-bold">{item.name}</p><p className="mt-3 font-mono text-xs font-bold text-orange">- {item.price_coin.toLocaleString("id-ID")} Koin</p></div>
      </div>
      <p className="mt-3 text-right font-mono text-[10px] text-foreground/45">Saldo: {coinBalance.toLocaleString("id-ID")} Koin</p>
      {message ? <p role="alert" className="mt-3 rounded-lg border border-red/25 bg-red/8 px-3 py-2 text-[10px] text-red">{message}</p> : null}
    </ConfirmationModal>
  );
}
