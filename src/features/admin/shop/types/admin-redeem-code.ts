export type AdminRedeemCodeStatus = "available" | "claimed" | "expired" | string;

export type AdminRedeemCode = {
  redeem_code_id: string;
  redeem_item_id: string;
  redeem_item_name: string;
  code: string;
  status: AdminRedeemCodeStatus;
  claimed_by_user_id: string | null;
  claimed_by: string;
  claimed_at: string | null;
  expires_at: string;
  created_at: string;
};

export type AdminRedeemCodesPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type AdminRedeemCodesQuery = {
  page: number;
  limit: number;
  search?: string;
  redeemItemId?: string;
  status?: string;
};

export type AdminRedeemCodesResponse = {
  redeem_codes: AdminRedeemCode[] | null;
  pagination: AdminRedeemCodesPagination;
};

export type CreateAdminRedeemCodeResponse = { redeem_code: AdminRedeemCode };
export type UploadAdminRedeemCodesResponse = { created_count: number };
export type DeleteAdminRedeemCodeResponse = { redeem_code_id: string };
export type AdminRedeemCodeActionState = { error: string | null };
