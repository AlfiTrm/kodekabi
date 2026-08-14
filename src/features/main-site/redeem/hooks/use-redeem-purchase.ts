"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { purchaseRedeemItemAction } from "../actions/purchase-redeem-item-action";
import type { RedeemItem } from "../types/redeem";

export function useRedeemPurchase(initialItem: RedeemItem, initialCoinBalance: number) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [coinBalance, setCoinBalance] = useState(initialCoinBalance);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [redeemCode, setRedeemCode] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function purchase() {
    setPending(true);
    setMessage(null);
    startTransition(async () => {
      const result = await purchaseRedeemItemAction(item.redeem_item_id);
      if (result.success) {
        setItem(result.data.item);
        setCoinBalance(result.data.coin_balance);
        setRedeemCode(result.data.code);
        setConfirmationOpen(false);
        router.refresh();
      } else {
        setMessage(result.message);
      }
      setPending(false);
    });
  }

  return {
    item,
    coinBalance,
    confirmationOpen,
    redeemCode,
    pending,
    message,
    openConfirmation: () => {
      setMessage(null);
      setConfirmationOpen(true);
    },
    closeConfirmation: () => {
      if (!pending) setConfirmationOpen(false);
    },
    closeSuccess: () => setRedeemCode(null),
    purchase,
  };
}
