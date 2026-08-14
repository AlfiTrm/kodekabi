export type AdminRedeemType = {
  redeem_type_id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type AdminRedeemItem = {
  redeem_item_id: string;
  redeem_type_id: string;
  type: AdminRedeemType;
  name: string;
  partner_name: string;
  description: string;
  price_coin: number;
  max_claim_per_period: number;
  claim_period: string;
  minimum_level: number;
  image_url: string;
  is_stock_visible: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AdminRedeemItemsPagination = { page: number; limit: number; total: number; total_pages: number };
export type AdminRedeemItemsQuery = { page: number; limit: number; search?: string; typeCode?: string; status?: string; claimPeriod?: string };
export type AdminRedeemItemsResponse = { items: AdminRedeemItem[] | null; pagination: AdminRedeemItemsPagination };
export type AdminRedeemTypesResponse = { types: AdminRedeemType[] | null };
export type AdminRedeemTypesWireResponse =
  | AdminRedeemType[]
  | AdminRedeemTypesResponse
  | { data: AdminRedeemType[] | AdminRedeemTypesResponse | null };
export type AdminRedeemItemDetailResponse = { item: AdminRedeemItem };
export type AdminRedeemItemMutationResponse = { item: AdminRedeemItem };
export type DeleteAdminRedeemItemResponse = { redeem_item_id: string };
export type AdminRedeemItemActionState = { error: string | null };
