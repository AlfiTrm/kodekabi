// ─── Enums (sesuai SRS 12.2.11.6) ───────────────────────────────────────────

export const THEME_OPTIONS = [
  { value: "misleading_health_advice", label: "Saran kesehatan menyesatkan" },
  { value: "chatbot_hallucination", label: "Halusinasi chatbot" },
  { value: "clickbait_headline", label: "Judul artikel manipulatif" },
  { value: "statistic_out_of_context", label: "Statistik di luar konteks" },
  { value: "forum_misinformation", label: "Validasi informasi keliru di forum" },
  { value: "viral_conflict_content", label: "Konten viral yang memperkuat konflik" },
  { value: "algorithmic_echo_chamber", label: "Sistem rekomendasi/ruang gema" },
  { value: "other", label: "Lainnya" },
] as const;

export const COMPETENCY_OPTIONS = [
  { value: "evidence_evaluation", label: "Evaluasi bukti" },
  { value: "claim_analysis", label: "Analisis klaim" },
  { value: "confidence_calibration", label: "Kalibrasi keyakinan" },
  { value: "reasoning", label: "Penalaran" },
  { value: "safety_judgment", label: "Penilaian keamanan/keputusan" },
] as const;

export const DIFFICULTY_OPTIONS = [
  { value: "low", label: "Mudah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Sulit" },
] as const;

export type ThemeValue = (typeof THEME_OPTIONS)[number]["value"];
export type CompetencyValue = (typeof COMPETENCY_OPTIONS)[number]["value"];
export type DifficultyValue = (typeof DIFFICULTY_OPTIONS)[number]["value"];

// ─── AI Generation Result ────────────────────────────────────────────────────

export type AiGeneratedCaseMetadata = {
  title: string;
  theme_tags: string[];
  risk_level: "low" | "medium" | "high";
  estimated_duration_minutes: number;
  unlock_requirement: {
    min_level: number;
    min_reputation: number;
    prerequisite_case_ids: string[];
  };
  thumbnail_prompt: string;
  /** AI-generated description based on the theme & competency focus */
  short_description: string;
};

export type GenerateCaseMetadataRequest = {
  theme: ThemeValue;
  theme_other_text?: string;
  competency_focus: CompetencyValue;
  difficulty: DifficultyValue;
};

export type GenerateCaseMetadataResponse =
  | { success: true; metadata: AiGeneratedCaseMetadata }
  | { success: false; error: string };

export type GenerateThumbnailRequest = {
  thumbnail_prompt: string;
};

export type GenerateThumbnailResponse =
  | { success: true; image_url: string }
  | { success: false; error: string };
