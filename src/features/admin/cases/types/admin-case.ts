export type AdminCaseStatus = "draft" | "published" | "archived" | string;
export type AdminCaseDifficulty = "low" | "medium" | "high" | string;

export type AdminCase = {
  case_id: string;
  current_case_version_id: string;
  version_number: number;
  version_label: string;
  title: string;
  slug: string;
  short_description: string;
  theme: string;
  theme_other_text: string | null;
  competency_focus: string;
  difficulty_level: AdminCaseDifficulty;
  risk_level: string;
  estimated_duration_minutes: number;
  ai_model: string | null;
  minimum_level: number;
  minimum_reputation: number;
  unlock_requirement: string;
  thumbnail_url: string;
  thumbnail_prompt: string;
  generation_source: string;
  status: AdminCaseStatus;
  question_count: number;
  evidence_count: number;
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type AdminCasesPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type AdminCasesResponse = {
  cases: AdminCase[] | null;
  pagination: AdminCasesPagination | null;
};

export type AdminCasesQuery = {
  search?: string;
  status?: string;
  difficulty?: string;
  page: number;
  limit: number;
};

export type AdminCaseLookupOption = {
  value: string;
  label: string;
};

export type AdminCaseLookups = {
  themes: AdminCaseLookupOption[];
  competency_focuses: AdminCaseLookupOption[];
  difficulty_levels: AdminCaseLookupOption[];
  risk_levels: AdminCaseLookupOption[];
  generation_sources: AdminCaseLookupOption[];
};

export type CreateAdminCaseResponse = {
  case_id: string;
  case_version_id: string;
  version_number: number;
  version_label: string;
  title: string;
  slug: string;
  status: string;
  thumbnail_url: string;
  thumbnail_prompt: string;
  generation_source: string;
  created_by: string;
  created_at: string;
};

export type CreateAdminCaseActionState = {
  error: string | null;
};

export type DeleteAdminCaseResponse = {
  case_id: string;
};

export type DeleteAdminCaseActionState = {
  error: string | null;
};

export type EvidenceTemplateType =
  | "social_post"
  | "article"
  | "blog"
  | "forum_thread"
  | "chat_transcript"
  | "public_announcement";

export type CreateAdminEvidenceResponse = {
  evidence: AdminCaseEvidence & Record<string, unknown>;
};

export type EvidenceParticipant = { name: string };

export type AdminCaseEvidenceDetail = AdminCaseEvidence & {
  credibility_tags?: string[];
  author_name?: string;
  author_handle?: string;
  platform?: string;
  post_text?: string;
  timestamp?: string;
  likes_count?: number;
  shares_count?: number;
  comments_count?: number;
  is_verified_account?: boolean;
  image_prompt?: string;
  image_url?: string;
  headline?: string;
  source_name?: string;
  publish_date?: string;
  url?: string;
  body_text?: string;
  title?: string;
  blog_name?: string;
  thread_title?: string;
  forum_name?: string;
  posts?: Array<ForumPostDraft & Record<string, unknown>>;
  participants?: Array<string | EvidenceParticipant>;
  messages?: Array<ChatMessageDraft & Record<string, unknown>>;
  issuing_body?: string;
  date?: string;
};

export type AdminCaseEvidenceDetailResponse = {
  evidence: AdminCaseEvidenceDetail;
};

export type CreateAdminEvidenceActionState = {
  error: string | null;
};

export type DeleteAdminEvidenceResponse = {
  case_evidence_id: string;
};

export type DeleteAdminEvidenceActionState = {
  error: string | null;
};

export type UpdateAdminEvidenceActionState = {
  error: string | null;
};

export type ForumPostDraft = {
  author_name: string;
  timestamp: string;
  upvote_count: number;
  text: string;
};

export type ChatMessageDraft = {
  sender: string;
  timestamp: string;
  text: string;
};

export type AdminCaseEvidence = {
  case_evidence_id: string;
  case_version_id: string;
  template_type: string;
  label: string;
  is_critical: boolean;
  has_image: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminCaseDetailResponse = {
  case: AdminCase;
  evidences: AdminCaseEvidence[] | null;
};

export type AdminCaseEvidencesResponse = {
  case_id: string;
  case_version_id: string;
  total: number;
  evidences: AdminCaseEvidence[] | null;
};
