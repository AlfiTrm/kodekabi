export type ShopCategoryFilter = "all" | "avatar";

export type ShopItem = {
  item_id: string;
  item_category_id: string;
  category_code: string;
  category_name: string;
  avatar_id: string | null;
  name: string;
  description: string;
  price_coin: number;
  image_url: string;
  ownership_status: string;
  is_owned: boolean;
  is_equipped: boolean;
  can_purchase: boolean;
  can_equip: boolean;
};

export type ShopPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type ShopItemsResponse = {
  items: ShopItem[] | null;
  pagination: ShopPagination | null;
};

export type ShopItemDetailResponse = {
  item: ShopItem;
  related_items: ShopItem[] | null;
  coin_balance: number;
};

export type ShopItemMutationResponse = {
  item: ShopItem;
};

export type EquipShopItemMutationResponse = ShopItemMutationResponse & {
  avatar_id: string | null;
};

export type ShopItemsQuery = {
  page: number;
  limit: number;
  category: ShopCategoryFilter;
  search?: string;
};
