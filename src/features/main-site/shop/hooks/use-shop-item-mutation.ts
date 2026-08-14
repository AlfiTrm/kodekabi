"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { equipShopItemAction } from "../actions/equip-shop-item-action";
import { purchaseShopItemAction } from "../actions/purchase-shop-item-action";
import type { ShopItem } from "../types/shop";

export function useShopItemMutation(initialItem: ShopItem) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function run(kind: "purchase" | "equip") {
    setPending(true);
    setMessage(null);

    startTransition(async () => {
      const result = kind === "purchase"
        ? await purchaseShopItemAction(item.item_id)
        : await equipShopItemAction(item.item_id);

      if (result.success) {
        setItem(result.data.item);
        router.refresh();
      } else {
        setMessage(result.message);
      }

      setPending(false);
    });
  }

  return {
    item,
    pending,
    message,
    purchase: () => run("purchase"),
    equip: () => run("equip"),
  };
}
