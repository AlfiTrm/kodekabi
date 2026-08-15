"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { callQwenText, generateQwenImage, downloadImageAsFile } from "@/src/features/admin/ai-generation/services/alibaba-ai-service";
import { createAdminCaseEvidence, getAdminCaseDetail, getAdminCaseChatbotConfig } from "../services/admin-cases-service";
import { ApiError } from "@/src/shared/services/api/api-error";

const SYSTEM_PROMPT = `Kamu membantu tim pembuat skenario game investigasi merancang bukti kasus (evidences).
TUGASMU:
Hasilkan 1 item evidence yang sangat detail untuk sebuah kasus investigasi.
Evidence bisa berupa social_post, article, blog, forum_thread, chat_transcript, atau public_announcement.
Output HARUS JSON valid dengan struktur:
{
  "evidences": [
    {
      "template_type": "social_post | article | blog | forum_thread | chat_transcript | public_announcement",
      "label": "Label pendek untuk evidence",
      "credibility_tags": ["hoax", "fact", dll],
      "is_critical": true/false,
      "needs_image": true/false, // Set true jika butuh gambar ilustrasi (hanya untuk social_post, article, blog)
      "image_prompt": "Prompt visual deskriptif berbahasa Inggris untuk AI image generator (hanya jika needs_image: true)",
      // Kolom berdasarkan template_type:
      // - social_post: author_name, author_handle, platform, post_text, timestamp (YYYY-MM-DD HH:MM:SS), likes_count, shares_count, comments_count, is_verified_account (true/false)
      // - article: headline, source_name, author_name, publish_date (YYYY-MM-DD), url, body_text
      // - blog: title, author_name, blog_name, publish_date (YYYY-MM-DD), body_text
      // - forum_thread: thread_title, forum_name, posts (array of: author_name, timestamp (YYYY-MM-DD HH:MM:SS), upvote_count, text)
      // - chat_transcript: participants (array of string), messages (array of: sender, timestamp (YYYY-MM-DD HH:MM:SS), text)
      // - public_announcement: issuing_body, title, date (YYYY-MM-DD), body_text
    }
  ]
}
Pastikan konten masuk akal, terhubung satu sama lain, dan mendukung alur cerita kasus.
Gunakan nama, tempat, dan institusi fiktif (misal: "Kota Nusa", "SehatNusa").`;

export async function generateAiEvidencesAction(caseId: string, caseSlug: string, versionId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return { error: "Unauthorized" };
  }

  try {
    const [detailRes, chatbotRes] = await Promise.allSettled([
      getAdminCaseDetail(caseId, accessToken),
      getAdminCaseChatbotConfig(caseId, accessToken)
    ]);

    if (detailRes.status === "rejected") throw new Error("Gagal mengambil detail kasus.");
    
    const caseItem = detailRes.value.case;
      
    let chatbotContext = "";
    if (chatbotRes.status === "fulfilled" && chatbotRes.value) {
      const bot = Array.isArray(chatbotRes.value) ? chatbotRes.value[0] : chatbotRes.value;
      if (bot && bot.bot_name) {
        chatbotContext = `Chatbot: ${bot.bot_name}\\nPersona: ${bot.bot_persona_description}`;
      }
    }

    const taskPrompt = `Buatkan 3-5 item evidence untuk kasus ini:
Judul: ${caseItem.title}
Deskripsi Singkat: ${caseItem.short_description}
${chatbotContext ? "\\n" + chatbotContext : ""}`;

    const rawJson = await callQwenText([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: taskPrompt },
    ]);

    const result = JSON.parse(rawJson);
    if (!result.evidences || !Array.isArray(result.evidences) || result.evidences.length === 0) {
      throw new Error("AI mengembalikan format yang tidak valid.");
    }

    let successCount = 0;
    
    for (let i = 0; i < result.evidences.length; i++) {
      const e = result.evidences[i];
      const templateType = e.template_type;
      
      const isMultipart = ["social_post", "article", "blog"].includes(templateType);
      let payload: FormData | Record<string, unknown>;

      if (isMultipart) {
        payload = new FormData();
        payload.set("label", String(e.label || "AI Generated Evidence"));
        payload.set("credibility_tags", JSON.stringify(e.credibility_tags || []));
        payload.set("is_critical", String(!!e.is_critical));
        payload.set("sort_order", String(i + 1));
        
        const fields = ["author_name", "author_handle", "platform", "post_text", "timestamp", "likes_count", "shares_count", "comments_count", "is_verified_account", "headline", "source_name", "publish_date", "url", "body_text", "title", "blog_name", "image_prompt"];
        for (const f of fields) {
          if (e[f] !== undefined) {
            let val = String(e[f]);
            if (f === "timestamp" || f === "publish_date" || f === "date") {
              val = val.replace("T", " ");
              if (f === "timestamp" && val.length === 16) {
                val += ":00";
              }
            }
            payload.set(f, val);
          }
        }
        
        if (e.needs_image && e.image_prompt) {
          try {
            const imageUrl = await generateQwenImage(e.image_prompt);
            const imageFile = await downloadImageAsFile(imageUrl, "evidence-ai-generated.png");
            payload.set("image", imageFile);
          } catch (imgError) {
            console.error("Gagal generate image untuk evidence:", imgError);
            // Tetap simpan evidence tanpa gambar jika gagal
          }
        }
      } else {
        if (Array.isArray(e.posts)) {
          e.posts = e.posts.map((p: any) => {
            let ts = p.timestamp ? String(p.timestamp).replace("T", " ") : "";
            if (ts.length === 16) ts += ":00";
            return { ...p, timestamp: ts };
          });
        }
        if (Array.isArray(e.messages)) {
          e.messages = e.messages.map((m: any) => {
            let ts = m.timestamp ? String(m.timestamp).replace("T", " ") : "";
            if (ts.length === 16) ts += ":00";
            return { ...m, timestamp: ts };
          });
        }

        payload = {
          label: e.label || "AI Generated Evidence",
          credibility_tags: e.credibility_tags || [],
          is_critical: !!e.is_critical,
          sort_order: i + 1,
          ...e
        };
      }

      await createAdminCaseEvidence(caseId, versionId, templateType, payload, accessToken);
      successCount++;
    }

    revalidatePath(`/admin/cases/${caseSlug}`);
    return { success: true, count: successCount };
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: error instanceof Error ? error.message : "Terjadi kesalahan saat memanggil AI." };
  }
}
