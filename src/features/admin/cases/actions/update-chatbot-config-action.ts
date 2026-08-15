"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminCaseChatbotConfig } from "../services/admin-cases-service";

export type UpdateChatbotConfigState = { error: string | null; success?: boolean };

export async function updateChatbotConfigAction(
  caseId: string,
  _state: UpdateChatbotConfigState,
  formData: FormData
): Promise<UpdateChatbotConfigState> {
  const botName = String(formData.get("bot_name") ?? "").trim();
  const persona = String(formData.get("bot_persona_description") ?? "").trim();
  const boundary = String(formData.get("knowledge_boundary") ?? "").trim();
  
  const prohibitedBehaviors = formData.getAll("prohibited_behaviors").map((s) => String(s).trim()).filter(Boolean);
  const suggestedQuestions = formData.getAll("suggested_questions").map((s) => String(s).trim()).filter(Boolean);

  if (!botName || !persona || !boundary) {
    return { error: "Nama bot, persona, dan batasan pengetahuan wajib diisi." };
  }

  const payload = {
    bot_name: botName,
    bot_persona_description: persona,
    knowledge_boundary: boundary,
    prohibited_behaviors: prohibitedBehaviors,
    suggested_questions: suggestedQuestions,
  };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await updateAdminCaseChatbotConfig(caseId, payload, accessToken);
    revalidatePath("/admin/cases");
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Gagal menyimpan konfigurasi chatbot." };
  }
}
