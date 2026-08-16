"use server";

import type { GameplayChatbotConfig, GameplayCase } from "../types/gameplay";

type InterrogationMessage = {
  sender: "user" | "assistant";
  text: string;
};

export async function chatInterrogationAction(
  config: GameplayChatbotConfig,
  caseCtx: GameplayCase,
  history: InterrogationMessage[],
  userMessage: string
) {
  try {
    const systemPrompt = `You are playing the role of ${config.bot_name}. 
Your personality and knowledge are defined by the following rules:
${config.bot_persona_description}

Context Case yang sedang dimainkan:
- Judul: ${caseCtx.title}
- Deskripsi Singkat: ${caseCtx.short_description}

Knowledge Boundary (BATASAN PENGETAHUAN - WAJIB DIPATUHI):
${config.knowledge_boundary}

Prohibited Behaviors (YANG DILARANG KERAS):
${config.prohibited_behaviors.map(p => `- ${p}`).join("\n")}

Guidelines:
- Never break character. Always answer as ${config.bot_name}.
- Keep your answers concise, natural, and conversational (1-3 sentences maximum).
- Do not use markdown formatting like **bold** or *italics*.
- Respond using the language context established by the user.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: userMessage },
    ];

    const apiKey = process.env.SUMOPOD_API_KEY;
    if (!apiKey) {
      throw new Error("API Key Sumopod belum dikonfigurasi di .env");
    }

    const response = await fetch(
      "https://ai.sumopod.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gemini/gemini-3.1-flash-lite",
          messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[gameplay] Sumopod API error:", errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText =
      data.choices?.[0]?.message?.content ||
      "Maaf, tidak ada respon.";

    return { success: true, text: responseText };
  } catch (error) {
    console.error("[gameplay] chat interrogation error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Terjadi kesalahan saat memproses jawaban AI." 
    };
  }
}
