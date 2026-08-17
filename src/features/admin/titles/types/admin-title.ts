export type AdminTitle = {
  title_id: string;
  title: string;
  unlock_level: number;
  image_border: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AdminTitlesPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type AdminTitlesQuery = {
  search?: string;
  page: number;
  limit: number;
};

export type AdminTitlesResponse = {
  titles: AdminTitle[] | null;
  pagination: AdminTitlesPagination | null;
};

export type AdminTitleDetailResponse = { title: AdminTitle };
export type AdminTitleMutationResponse = { title: AdminTitle };
export type DeleteAdminTitleResponse = { title_id: string };

export type AdminTitleActionState = {
  error: string | null;
};
