import "server-only";

import type { AdminQuestionType } from "@/src/features/admin/cases/types/admin-case";
import { callQwenText } from "./alibaba-ai-service";

// ─── Referensi Jenis Question ───────────────────────────────────────────────

export const questionTypeOptions: Array<{ value: AdminQuestionType; label: string }> = [
  { value: "mcq", label: "Multiple Choice (MCQ)" },
  { value: "open_ended", label: "Open-ended (Jawaban Terbuka)" },
  { value: "confidence_slider", label: "Confidence Slider" },
  { value: "claim_classification", label: "Claim Classification" },
];

const QUESTION_TYPES = questionTypeOptions.map((option) => option.value);

export function questionTypeLabel(type: AdminQuestionType): string {
  return questionTypeOptions.find((option) => option.value === type)?.label ?? type;
}

/**
 * Memilih satu jenis pertanyaan secara acak dari keempat tipe yang tersedia.
 */
export function pickRandomQuestionType(): AdminQuestionType {
  const index = Math.floor(Math.random() * QUESTION_TYPES.length);
  return QUESTION_TYPES[index];
}

// ─── Konteks Input AI ───────────────────────────────────────────────────────

export type QuestionGenerationContext = {
  title: string;
  short_description: string;
  chatbotContext?: string;
  evidenceContext?: string;
};

const SHARED_CONSTITUTION = `Kamu membantu tim KODEKABI: Jejak Algoritma menyusun konten case investigasi literasi digital. Semesta cerita: Kota Nusa, kota virtual fiktif. SELURUH entitas (nama orang, media, akun, platform, institusi) HARUS fiktif — dilarang menyebut entitas nyata. Output HARUS JSON valid, tanpa teks lain, tanpa markdown fence, tanpa komentar pembuka/penutup.`;

// ─── Skema per Jenis Question ───────────────────────────────────────────────

const SCHEMA_BY_TYPE: Record<AdminQuestionType, string> = {
  mcq: `TUGASMU:
Hasilkan SATU pertanyaan pilihan ganda (MCQ) yang menguji pemahaman pemain terhadap kasus.
Output JSON dengan struktur:
{
  "question_text": string,
  "explanation": string (alasan jawaban yang benar),
  "options": [
    { "option_code": "A", "option_text": string, "is_correct": boolean },
    { "option_code": "B", "option_text": string, "is_correct": boolean },
    { "option_code": "C", "option_text": string, "is_correct": boolean },
    { "option_code": "D", "option_text": string, "is_correct": boolean }
  ]
}
Aturan:
- Sediakan tepat 4 pilihan (A, B, C, D).
- Tepat SATU pilihan harus is_correct: true, sisanya false.`,
  open_ended: `TUGASMU:
Hasilkan SATU pertanyaan jawaban terbuka (open-ended) yang menguji kemampuan pemain menjelaskan temuan kasus.
Output JSON dengan struktur:
{
  "question_text": string,
  "expected_key_points": string (poin penting yang wajib disebutkan pemain),
  "minimum_keywords": array of string (3-5 kata kunci minimum),
  "evaluation_rubric": string (cara pembagian skor, misal "Skor 3: menyebut semua poin..."),
  "max_score": integer (1-5)
}
Aturan:
- minimum_keywords minimal 3 kata kunci yang relevan dengan kasus.`,
  confidence_slider: `TUGASMU:
Hasilkan SATU pertanyaan confidence slider yang meminta pemain menilai tingkat keyakinan terhadap suatu klaim/bukti.
Output JSON dengan struktur:
{
  "question_text": string,
  "min_value": 0,
  "max_value": 100,
  "snap_interval": 5,
  "default_value": 50,
  "label_low": string (misal "Tidak Yakin"),
  "label_high": string (misal "Sangat Yakin"),
  "show_warning_on_large_change": boolean
}
Aturan:
- min_value selalu 0 dan max_value selalu 100.`,
  claim_classification: `TUGASMU:
Hasilkan SATU pertanyaan klasifikasi klaim yang meminta pemain mengelompokkan suatu klaim ke dalam taksonomi.
Output JSON dengan struktur:
{
  "question_text": string,
  "taxonomy_tags": array of string (3-5 tag, misal ["Fakta", "Opini", "Pengalaman", "Belum Terverifikasi"]),
  "correct_answer": string (WAJIB salah satu dari taxonomy_tags),
  "explanation": string (alasan klasifikasi yang benar)
}
Aturan:
- taxonomy_tags minimal 3 tag dan correct_answer WAJIB ada di dalam taxonomy_tags.`,
};

// ─── Normalisasi Hasil AI ───────────────────────────────────────────────────

type McqOption = { option_code: string; option_text: string; is_correct: boolean };

function normalizeMcq(raw: Record<string, unknown>): Record<string, unknown> {
  const options = Array.isArray(raw.options) ? (raw.options as McqOption[]) : [];
  if (options.length < 2 || options.filter((option) => option.is_correct).length !== 1) {
    throw new Error("AI menghasilkan opsi MCQ yang tidak valid.");
  }
  return {
    question_text: String(raw.question_text ?? ""),
    explanation: String(raw.explanation ?? ""),
    options,
  };
}

function normalizeOpenEnded(raw: Record<string, unknown>): Record<string, unknown> {
  const minimumKeywords = Array.isArray(raw.minimum_keywords)
    ? raw.minimum_keywords.filter((keyword): keyword is string => typeof keyword === "string" && keyword.trim().length > 0)
    : [];
  if (minimumKeywords.length === 0) throw new Error("AI menghasilkan minimum_keywords yang kosong.");
  return {
    question_text: String(raw.question_text ?? ""),
    expected_key_points: String(raw.expected_key_points ?? ""),
    minimum_keywords: minimumKeywords,
    evaluation_rubric: String(raw.evaluation_rubric ?? ""),
    max_score: Number(raw.max_score) || 3,
  };
}

function normalizeConfidenceSlider(raw: Record<string, unknown>): Record<string, unknown> {
  return {
    question_text: String(raw.question_text ?? ""),
    min_value: 0,
    max_value: 100,
    snap_interval: Number(raw.snap_interval) || 5,
    default_value: Number(raw.default_value) ?? 50,
    label_low: String(raw.label_low ?? "Tidak Yakin"),
    label_high: String(raw.label_high ?? "Sangat Yakin"),
    show_warning_on_large_change: Boolean(raw.show_warning_on_large_change),
  };
}

function normalizeClaimClassification(raw: Record<string, unknown>): Record<string, unknown> {
  const taxonomyTags = Array.isArray(raw.taxonomy_tags)
    ? raw.taxonomy_tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    : [];
  const correctAnswer = String(raw.correct_answer ?? "");
  if (taxonomyTags.length < 2 || !taxonomyTags.includes(correctAnswer)) {
    throw new Error("AI menghasilkan taxonomy_tags/correct_answer yang tidak valid.");
  }
  return {
    question_text: String(raw.question_text ?? ""),
    taxonomy_tags: taxonomyTags,
    correct_answer: correctAnswer,
    explanation: String(raw.explanation ?? ""),
  };
}

const NORMALIZER_BY_TYPE: Record<AdminQuestionType, (raw: Record<string, unknown>) => Record<string, unknown>> = {
  mcq: normalizeMcq,
  open_ended: normalizeOpenEnded,
  confidence_slider: normalizeConfidenceSlider,
  claim_classification: normalizeClaimClassification,
};

export type GeneratedQuestionPayload = {
  question_type: AdminQuestionType;
  payload: Record<string, unknown>;
};

/**
 * Mengirim jenis pertanyaan yang sudah terpilih ke Qwen (Alibaba) lalu
 * mengembalikan payload yang siap dikirim ke API backend.
 */
export async function generateQuestionPayload(type: AdminQuestionType, context: QuestionGenerationContext): Promise<GeneratedQuestionPayload> {
  const systemPrompt = `${SHARED_CONSTITUTION}

${SCHEMA_BY_TYPE[type]}`;

  const taskPrompt = `Buatkan 1 pertanyaan bertipe "${questionTypeLabel(type)}" untuk kasus ini:
Judul: ${context.title}
Deskripsi Singkat: ${context.short_description}
${context.chatbotContext ? `\n${context.chatbotContext}` : ""}
${context.evidenceContext ? `\nEvidence yang tersedia:\n${context.evidenceContext}` : ""}`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    { role: "user", content: taskPrompt },
  ];

  console.log("[generate-question] type:", type);
  console.log("[generate-question] sent-to-ai:", JSON.stringify(messages, null, 2));

  const rawJson = await callQwenText(messages);

  console.log("[generate-question] ai-response:", rawJson);

  const parsed = JSON.parse(rawJson) as Record<string, unknown>;
  const payload = NORMALIZER_BY_TYPE[type](parsed);

  if (typeof payload.question_text !== "string" || !payload.question_text.trim()) {
    throw new Error("AI menghasilkan question_text yang kosong.");
  }

  return { question_type: type, payload };
}
