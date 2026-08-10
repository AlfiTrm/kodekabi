export type AdminUserStatus = "active" | "suspended" | "banned" | string;

export type AdminUser = {
  user_id: string;
  username: string;
  email: string;
  role_name: string;
  status: AdminUserStatus;
  current_level: number;
  avatar_url: string | null;
  created_at: string;
};

export type AdminUsersPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type AdminUsersResponse = {
  users: AdminUser[];
  pagination: AdminUsersPagination;
};

export type AdminUsersQuery = {
  search?: string;
  role?: string;
  status?: string;
  page: number;
  limit: number;
};

export type AdminRole = {
  role_id: string;
  role_name: string;
};

export type AdminUserDetail = AdminUser & {
  role_id: string;
  user_profile_id: string;
  avatar_id: string | null;
  title: string;
  current_xp: number;
  auditor_reputation: number;
  evidence_evaluation_score: number;
  claim_analysis_score: number;
  confidence_calibration_score: number;
  reasoning_score: number;
  safety_judgment_score: number;
  updated_at: string;
};

export type AdminRecentProgressItem = {
  case_id?: string;
  case_title?: string;
  title?: string;
  status?: string;
  result?: string;
  updated_at?: string;
};

export type AdminUserDetailResponse = {
  user: AdminUserDetail;
  recent_progress: {
    items: AdminRecentProgressItem[] | null;
  } | null;
};

export type CreateAdminUserRequest = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_name: string;
  status: string;
};

export type CreateAdminUserResponse = {
  user: AdminUserDetail;
};

export type CreateAdminUserActionState = {
  error: string | null;
};

export type UpdateAdminUserRequest = {
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role_name: string;
  status: string;
};

export type UpdateAdminUserResponse = {
  user: AdminUserDetail;
};

export type UpdateAdminUserActionState = {
  error: string | null;
};

export type UpdateAdminUserAccessRequest = {
  role_name: string;
  status: string;
};

export type UpdateAdminUserAccessResponse = {
  user_id: string;
  role_name: string;
  status: string;
};

export type UpdateAdminUserAccessActionState = {
  error: string | null;
  success: string | null;
};

export type DeleteAdminUserResponse = {
  user_id: string;
};

export type DeleteAdminUserActionState = {
  error: string | null;
};
