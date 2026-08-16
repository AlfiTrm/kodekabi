import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { getAdminCaseChatbotConfig } from "../services/admin-cases-service";
import type { AdminCase } from "../types/admin-case";
import { ChatbotConfigForm } from "./chatbot-config-form";

type ChatbotConfigProps = {
  caseItem: AdminCase;
};

export async function CaseChatbotConfig({ caseItem }: ChatbotConfigProps) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let initialData = null;
  try {
    initialData = await getAdminCaseChatbotConfig(caseItem.case_id, accessToken);
  } catch {
    // API returns 404 or fails if not configured yet
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border-strong pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-lg font-bold">Chatbot Configuration</h2>
          <p className="mt-1 text-xs text-foreground/60">
            Atur persona, batasan pengetahuan, dan perilaku AI Chatbot untuk studi kasus ini.
          </p>
        </div>
      </div>
      
      <ChatbotConfigForm caseId={caseItem.case_id} caseItem={caseItem} initialData={initialData} />
    </div>
  );
}
