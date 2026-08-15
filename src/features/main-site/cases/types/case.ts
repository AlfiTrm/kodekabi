export type CaseFilter = "all" | "in_progress" | "completed";

export type UserCase = {
  case_id: string;
  title: string;
  slug: string;
  short_description: string;
  difficulty_level: string;
  estimated_duration_minutes: number;
  minimum_level: number;
  minimum_reputation: number;
  thumbnail_url: string;
  access_status: string;
  progress_status: string;
  locked_reason: string | null;
  published_at: string | null;
  created_at: string;
};

export type UserCasesPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type UserCasesResponse = {
  cases: UserCase[] | null;
  pagination: UserCasesPagination | null;
};

export type UserCasesQuery = {
  tab: CaseFilter;
  page: number;
  limit: number;
};
