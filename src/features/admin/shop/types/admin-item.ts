export type AdminItemCategory = {
  item_category_id: string;
  code: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type AdminItem = {
  item_id: string;
  item_category_id: string;
  category: AdminItemCategory;
  name: string;
  description: string;
  price_coin: number;
  image_url: string;
  is_visible: boolean;
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AdminItemsPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type AdminItemsQuery = {
  page: number;
  limit: number;
  categoryCode?: string;
  status?: string;
  isVisible?: boolean;
};

export type AdminItemsResponse = {
  items: AdminItem[] | null;
  pagination: AdminItemsPagination;
};

export type AdminItemDetailResponse = { item: AdminItem };
export type AdminItemMutationResponse = { item: AdminItem };
export type DeleteAdminItemResponse = { item_id: string };

export type AdminItemActionState = {
  error: string | null;
};

