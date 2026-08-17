import "server-only";

import { cache } from "react";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { ShopItem } from "../../shop/types/shop";

type UserInventoryResponse = {
  items?: ShopItem[] | null;
  inventory?: ShopItem[] | null;
  data?: { items?: ShopItem[] | null; groups?: InventoryGroup[] | null } | null;
  groups?: InventoryGroup[] | null;
};

type InventoryGroup = {
  type: string;
  label: string;
  items?: Array<{
    user_item_id: string;
    equipped_at?: string | null;
    shop?: Partial<ShopItem> | null;
    redeem?: { redeem_item_id?: string; type_name?: string; name?: string; description?: string; image_url?: string } | null;
  }> | null;
};

export const getUserInventory = cache(async (accessToken: string) => {
  const result = await serverApi<UserInventoryResponse>("/users/inventory", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  console.log("[inventory-debug] Response /users/inventory:", result);

  const directItems = Array.isArray(result.items)
    ? result.items
    : Array.isArray(result.inventory)
      ? result.inventory
      : Array.isArray(result.data?.items)
        ? result.data.items
        : [];
  const groups = result.groups ?? result.data?.groups ?? [];
  const groupItems = groups.flatMap((group) => (group.items ?? [])
    .filter((entry) => Boolean(entry.shop?.name || entry.redeem?.name))
    .map((entry) => {
    const source = entry.shop ?? entry.redeem ?? {};
    const isShopItem = Boolean(entry.shop);
    return {
      item_id: entry.shop?.item_id ?? entry.redeem?.redeem_item_id ?? entry.user_item_id,
      item_category_id: entry.shop?.item_category_id ?? "",
      category_code: entry.shop?.category_code ?? (entry.redeem ? "redeem" : group.type),
      category_name: entry.shop?.category_name ?? entry.redeem?.type_name ?? group.label,
      avatar_id: entry.shop?.avatar_id ?? null,
      name: source.name ?? "Item inventory",
      description: source.description ?? "Item dari inventory",
      price_coin: 0,
      image_url: source.image_url ?? "",
      ownership_status: "owned",
      is_owned: true,
      is_equipped: entry.shop?.is_equipped ?? Boolean(entry.equipped_at),
      can_purchase: false,
      can_equip: isShopItem,
    } satisfies ShopItem;
    }));
  const validDirectItems = directItems.filter((item) => typeof item.name === "string" && item.name.trim().length > 0);
  const items = validDirectItems.length ? validDirectItems : groupItems;

  console.log("[inventory-debug] Items yang dipakai profile:", items);
  return items;
});
