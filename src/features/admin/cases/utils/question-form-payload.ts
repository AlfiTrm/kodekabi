import type { AdminQuestionType } from "../types/admin-case";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function numeric(formData: FormData, name: string) {
  return Number(text(formData, name));
}

function stringArray(formData: FormData, name: string) {
  try {
    const value = JSON.parse(text(formData, name));
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function jsonArray(formData: FormData, name: string) {
  try {
    const value = JSON.parse(text(formData, name));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function formValue(formData: FormData, name: string) {
  return text(formData, name);
}

export function buildQuestionPayload(questionType: AdminQuestionType, formData: FormData): { payload?: Record<string, unknown>; error?: string } {
  const questionText = text(formData, "question_text");
  const scoringWeight = numeric(formData, "scoring_weight");
  const relatedEvidenceIds = stringArray(formData, "related_evidence_ids");
  const sortOrder = numeric(formData, "sort_order");
  if (!questionText) return { error: "Question text wajib diisi." };
  if (!Number.isFinite(scoringWeight) || scoringWeight < 1 || scoringWeight > 100) return { error: "Scoring weight harus antara 1 dan 100." };
  if (relatedEvidenceIds.length === 0) return { error: "Pilih minimal satu related evidence." };

  const common = { question_text: questionText, scoring_weight: scoringWeight, related_evidence_ids: relatedEvidenceIds, is_required: true, sort_order: Number.isFinite(sortOrder) ? Math.max(1, sortOrder) : 1 };
  if (questionType === "mcq") {
    const options = jsonArray(formData, "options") as Array<{ option_code?: string; option_text?: string; is_correct?: boolean }>;
    if (options.length < 2 || options.some((option) => !option.option_text?.trim())) return { error: "Isi minimal dua pilihan jawaban." };
    if (options.filter((option) => option.is_correct).length !== 1) return { error: "Pilih tepat satu jawaban yang benar." };
    return { payload: { ...common, options, explanation: text(formData, "explanation") } };
  }
  if (questionType === "open_ended") {
    const minimumKeywords = stringArray(formData, "minimum_keywords");
    const expectedKeyPoints = text(formData, "expected_key_points");
    const evaluationRubric = text(formData, "evaluation_rubric");
    const maxScore = numeric(formData, "max_score");
    if (!expectedKeyPoints || !evaluationRubric || minimumKeywords.length === 0 || maxScore < 1) return { error: "Lengkapi seluruh kriteria evaluasi semantik." };
    return { payload: { ...common, expected_key_points: expectedKeyPoints, minimum_keywords: minimumKeywords, evaluation_rubric: evaluationRubric, max_score: maxScore } };
  }
  if (questionType === "confidence_slider") {
    const minValue = numeric(formData, "min_value");
    const maxValue = numeric(formData, "max_value");
    const snapInterval = numeric(formData, "snap_interval");
    const defaultValue = numeric(formData, "default_value");
    if (minValue >= maxValue || snapInterval < 1 || defaultValue < minValue || defaultValue > maxValue) return { error: "Konfigurasi nilai confidence tidak valid." };
    return { payload: { ...common, min_value: minValue, max_value: maxValue, snap_interval: snapInterval, default_value: defaultValue, label_low: text(formData, "label_low"), label_high: text(formData, "label_high"), show_warning_on_large_change: text(formData, "show_warning_on_large_change") === "true" } };
  }
  const taxonomyTags = stringArray(formData, "taxonomy_tags");
  const correctAnswer = text(formData, "correct_answer");
  if (taxonomyTags.length < 2 || !taxonomyTags.includes(correctAnswer)) return { error: "Tambahkan minimal dua taxonomy tag dan pilih jawaban yang benar." };
  return { payload: { ...common, taxonomy_tags: taxonomyTags, correct_answer: correctAnswer, explanation: text(formData, "explanation") } };
}
