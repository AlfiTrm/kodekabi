import type { AdminQuestionType } from "../types/admin-case";

export const questionTypeOptions: Array<{ value: AdminQuestionType; label: string }> = [
  { value: "mcq", label: "Multiple Choice (MCQ)" },
  { value: "open_ended", label: "Open-ended (Jawaban Terbuka)" },
  { value: "confidence_slider", label: "Confidence Slider" },
  { value: "claim_classification", label: "Claim Classification" },
];

export function isAdminQuestionType(value: string): value is AdminQuestionType {
  return questionTypeOptions.some((option) => option.value === value);
}
