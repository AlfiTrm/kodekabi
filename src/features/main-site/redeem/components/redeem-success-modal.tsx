"use client";

import { useState } from "react";

import { ConfirmationModal } from "@/src/shared/components/ui/confirmation-modal";

import type { RedeemItem } from "../types/redeem";

export function RedeemSuccessModal({ item, code, coinBalance, onClose }: { item: RedeemItem; code: string; coinBalance: number; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <ConfirmationModal
      labelledBy="redeem-success-title"
      title="Reward Berhasil Dibeli."
      description={`Kode ${item.name} sudah siap digunakan.`}
      onClose={onClose}
      showCloseButton
      leading={<span aria-hidden="true" className="grid size-7 place-items-center rounded-full border-2 border-green text-sm font-bold text-green">&#10003;</span>}
      footer={<button type="button" onClick={onClose} className="h-11 cursor-pointer rounded-full bg-green px-7 text-xs font-bold text-button-ink hover:bg-green/85">Selesai</button>}
    >
      <div className="rounded-xl border border-purple/30 bg-purple/8 p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/45">Kode redeem</p>
        <div className="mt-2 flex items-center gap-3"><code className="min-w-0 flex-1 break-all font-mono text-sm font-bold text-foreground">{code}</code><button type="button" onClick={copyCode} className="shrink-0 cursor-pointer rounded-full border border-purple/35 px-4 py-2 text-[10px] font-bold text-purple hover:bg-purple/10">{copied ? "Tersalin" : "Salin"}</button></div>
      </div>
      <p className="mt-3 text-right font-mono text-[10px] text-foreground/45">Saldo tersisa: {coinBalance.toLocaleString("id-ID")} Koin</p>
    </ConfirmationModal>
  );
}
