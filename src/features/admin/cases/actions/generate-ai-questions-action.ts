"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { callQwenText } from "@/src/features/admin/ai-generation/services/alibaba-ai-service";
import { createAdminCaseQuestion, getAdminCaseEvidences, getAdminCaseDetail, getAdminCaseChatbotConfig } from "../services/admin-cases-service";
import { ApiError } from "@/src/shared/services/api/api-error";

const SYSTEM_PROMPT = `Kamu membantu tim pembuat skenario game investigasi merancang pertanyaan pilihan ganda (MCQ).
TUGASMU:
Hasilkan 3-5 pertanyaan pilihan ganda (MCQ) yang menguji pemahaman pemain tentang sebuah kasus investigasi.
Output HARUS JSON valid dengan struktur:
{
  "questions": [
    {
      "question_text": "Teks pertanyaan (fokus pada mengidentifikasi kebohongan/fakta kasus)",
      "explanation": "Penjelasan mengapa jawaban tersebut benar",
      "options": [
        { "option_code": "A", "option_text": "Pilihan A", "is_correct": true },
        { "option_code": "B", "option_text": "Pilihan B", "is_correct": false },
        { "option_code": "C", "option_text": "Pilihan C", "is_correct": false },
        { "option_code": "D", "option_text": "Pilihan D", "is_correct": false }
      ]
    }
  ]
}
Pastikan hanya ada satu jawaban benar per pertanyaan (is_correct: true).
Dilarang menggunakan entitas nyata, semua nama/tempat harus fiktif di dalam "Kota Nusa".`;

export async function generateAiQuestionsAction(caseId: string, caseSlug: string, versionId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return { error: "Unauthorized" };
  }

  try {
    // Fetch context
    const [detailRes, evidencesRes, chatbotRes] = await Promise.allSettled([
      getAdminCaseDetail(caseId, accessToken),
      getAdminCaseEvidences(caseId, accessToken),
      getAdminCaseChatbotConfig(caseId, accessToken)
    ]);

    if (detailRes.status === "rejected") throw new Error("Gagal mengambil detail kasus.");
    
    const caseItem = detailRes.value.case;
    const evidences = evidencesRes.status === "fulfilled" ? evidencesRes.value.evidences : [];
    
    // Extract context for AI
    if (!evidences || evidences.length === 0) {
      return { error: "Tidak ada evidence yang tersedia. Pastikan tab Evidence sudah terisi terlebih dahulu sebelum melakukan generate questions." };
    }
    
    const evidenceContext = evidences.map(e => `- ${e.label} (Tipe: ${e.template_type})`).join("\\n");
      
    let chatbotContext = "";
    if (chatbotRes.status === "fulfilled" && chatbotRes.value) {
      const bot = Array.isArray(chatbotRes.value) ? chatbotRes.value[0] : chatbotRes.value;
      if (bot && bot.bot_name) {
        chatbotContext = `Chatbot: ${bot.bot_name}\nPersona: ${bot.bot_persona_description}`;
      }
    }

    const taskPrompt = `Buatkan 3-5 pertanyaan MCQ untuk kasus ini:
Judul: ${caseItem.title}
Deskripsi Singkat: ${caseItem.short_description}
${chatbotContext ? "\\n" + chatbotContext : ""}
Evidence yang tersedia:
${evidenceContext}`;

    // Call AI
    const rawJson = await callQwenText([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: taskPrompt },
    ]);

    const result = JSON.parse(rawJson);
    if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
      throw new Error("AI mengembalikan format yang tidak valid.");
    }

    // Default to mapping to first evidence if available, otherwise empty array
    const defaultEvidenceIds = evidences && evidences.length > 0 ? [evidences[0].case_evidence_id] : [];

    // Save to DB
    let successCount = 0;
    for (let i = 0; i < result.questions.length; i++) {
      const q = result.questions[i];
      const payload = {
        question_text: q.question_text,
        explanation: q.explanation || "Penjelasan otomatis AI",
        scoring_weight: 20, // default equal weight
        is_required: true,
        sort_order: i + 1,
        related_evidence_ids: defaultEvidenceIds,
        options: q.options
      };

      await createAdminCaseQuestion(caseId, versionId, "mcq", payload, accessToken);
      successCount++;
    }

    revalidatePath(`/admin/cases/${caseSlug}`);
    return { success: true, count: successCount };
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: error instanceof Error ? error.message : "Terjadi kesalahan saat memanggil AI." };
  }
}
