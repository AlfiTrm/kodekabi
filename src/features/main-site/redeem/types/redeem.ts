export type RedeemFilter = "all" | "owned";

export type RedeemItem = {
  redeem_item_id: string;
  redeem_type_id: string;
  type_code: string;
  type_name: string;
  name: string;
  partner_name: string;
  description: string;
  price_coin: number;
  max_claim_per_period: number;
  claim_period: string;
  minimum_level: number;
  image_url: string;
  is_stock_visible: boolean;
  stock_remaining: number;
  user_claim_count: number;
  can_purchase: boolean;
};

export type RedeemPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type RedeemItemsResponse = {
  items: RedeemItem[] | null;
  pagination: RedeemPagination | null;
};

export type RedeemPurchaseResponse = {
  item: RedeemItem;
  code: string;
  coin_balance: number;
};
