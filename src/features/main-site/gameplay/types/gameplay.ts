export type GameplaySession = {
  case_session_id: string;
  user_id: string;
  case_id: string;
  case_version_id: string;
  session_version: number;
  status: string;
  initial_assessment: string | null;
  initial_confidence: number | null;
  started_at: string;
  last_activity_at: string;
  submitted_at: string | null;
};

export type GameplayCase = {
  case_id: string;
  case_version_id: string;
  version_number: number;
  title: string;
  slug: string;
  short_description: string;
  difficulty_level: string;
  risk_level: string;
  estimated_duration_minutes: number;
  minimum_level: number;
  minimum_reputation: number;
  thumbnail_url: string;
  published_at: string | null;
};

export type GameplayEvidence = {
  case_evidence_id: string;
  case_version_id: string;
  code: string;
  template_type: string;
  label: string;
  sort_order: number;
  opened: boolean;
  [key: string]: unknown;
};

export type GameplayQuestion = {
  case_question_id: string;
  case_version_id: string;
  code: string;
  question_type: string;
  question_text: string;
  is_required: boolean;
  sort_order: number;
  [key: string]: unknown;
};

export type GameplayChatbotConfig = {
  bot_name: string;
  bot_persona_description: string;
  knowledge_boundary: string;
  prohibited_behaviors: string[];
  suggested_questions: string[];
};

export type GameplayProgress = {
  opened_evidence_count: number;
  total_evidence_count: number;
  answered_question_count: number;
  required_question_count: number;
  can_take_decision: boolean;
};

export type GameplayResponse = {
  session: GameplaySession;
  case: GameplayCase;
  evidences: GameplayEvidence[] | null;
  questions: GameplayQuestion[] | null;
  chatbot_config: GameplayChatbotConfig | null;
  answers: GameplayAnswer[] | null;
  evidence_progress: unknown[] | null;
  progress: GameplayProgress;
};

export type OpenEvidenceResponse = {
  session: GameplaySession;
  evidence: GameplayEvidence;
  evidence_progress: unknown;
  progress: GameplayProgress;
};

export type GameplayAnswer = {
  case_question_id: string;
  question_type: string;
  value: Record<string, string | number>;
  confidence_final?: number;
  is_final: boolean;
};

export type SaveAnswersResponse = {
  session: GameplaySession;
  answers: GameplayAnswer[];
  progress: GameplayProgress;
};

export type SubmitGameplayResponse = {
  session: GameplaySession;
  outcome: {
    outcome_key: string;
    outcome_id: string;
    outcome_label: string;
    narrative: string;
    total_score: number;
  };
  score_breakdown: Array<{ category_key: string; category_label: string; score: number; weighted_score: number }>;
  city_impact: Array<{ key: string; label: string; delta: number; before: number; after: number }>;
  rewards: { xp_gained: number; coin_gained: number };
  progression: { level_after: number; xp_after: number; coin_balance_after: number; reputation_after: number };
  feedback: { strength_category: string; improvement_category: string; message: string };
};

