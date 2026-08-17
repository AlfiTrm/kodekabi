"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { generateQuestionPayload, pickRandomQuestionType, questionTypeLabel } from "@/src/features/admin/ai-generation/services/question-generation-service";
import { createAdminCaseQuestion, getAdminCaseEvidences, getAdminCaseEvidenceDetail, getAdminCaseDetail, getAdminCaseChatbotConfig } from "../services/admin-cases-service";
import { formatEvidenceDetail } from "../utils/evidence-context";
import { ApiError } from "@/src/shared/services/api/api-error";

export async function generateAiQuestionsAction(caseId: string, caseSlug: string, versionId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return { error: "Unauthorized" };
  }

  try {
    // 1. Ambil konteks kasus untuk diserahkan ke AI.
    const [detailRes, evidencesRes, chatbotRes] = await Promise.allSettled([
      getAdminCaseDetail(caseId, accessToken),
      getAdminCaseEvidences(caseId, accessToken),
      getAdminCaseChatbotConfig(caseId, accessToken),
    ]);

    if (detailRes.status === "rejected") throw new Error("Gagal mengambil detail kasus.");

    const caseItem = detailRes.value.case;
    const evidences = evidencesRes.status === "fulfilled" ? evidencesRes.value.evidences : [];

    if (!evidences || evidences.length === 0) {
      return { error: "Tidak ada evidence yang tersedia. Pastikan tab Evidence sudah terisi terlebih dahulu sebelum melakukan generate questions." };
    }

    const evidenceDetails = await Promise.all(
      evidences.map((evidence) =>
        getAdminCaseEvidenceDetail(caseId, versionId, evidence.case_evidence_id, accessToken)
          .then((result) => result.evidence)
          .catch(() => null),
      ),
    );

    const evidenceContext = evidences
      .map((evidence, index) => {
        const detail = evidenceDetails[index];
        return `Evidence ${index + 1}:\n${detail ? formatEvidenceDetail(detail) : `- ${evidence.label} (Tipe: ${evidence.template_type})`}`;
      })
      .join("\n\n");

    let chatbotContext = "";
    if (chatbotRes.status === "fulfilled" && chatbotRes.value) {
      const bot = Array.isArray(chatbotRes.value) ? chatbotRes.value[0] : chatbotRes.value;
      if (bot && bot.bot_name) {
        chatbotContext = `Chatbot: ${bot.bot_name}\nPersona: ${bot.bot_persona_description}`;
      }
    }

    // 2. Pilih jenis pertanyaan secara acak.
    const questionType = pickRandomQuestionType();

    // 3. Kirim jenis yang terpilih ke AI (Qwen/Alibaba) untuk menghasilkan pertanyaan.
    const generated = await generateQuestionPayload(questionType, {
      title: caseItem.title,
      short_description: caseItem.short_description,
      chatbotContext,
      evidenceContext,
    });

    // 4. Lengkapi field umum lalu simpan ke backend.
    const defaultEvidenceIds = [evidences[0].case_evidence_id];
    const payload = {
      ...generated.payload,
      scoring_weight: 20,
      related_evidence_ids: defaultEvidenceIds,
      is_required: true,
      sort_order: 1,
    };

    await createAdminCaseQuestion(caseId, versionId, questionType, payload, accessToken);

    revalidatePath(`/admin/cases/${caseSlug}`);
    return { success: true, count: 1, type: questionTypeLabel(questionType) };
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: error instanceof Error ? error.message : "Terjadi kesalahan saat memanggil AI." };
  }
}
