import { serverEnv } from "@/src/shared/config/server-env";

// ─── Text Generation (Qwen LLM) ─────────────────────────────────────────────

type QwenMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type QwenTextResponse = {
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
};

/**
 * Calls Alibaba Qwen LLM with the given messages.
 * Uses response_format: json_object to guarantee valid JSON output.
 */
export async function callQwenText(messages: QwenMessage[], timeoutMs = 25_000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${serverEnv.alibabaBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverEnv.alibabaApiKey}`,
      },
      body: JSON.stringify({
        model: serverEnv.alibabaTextModel,
        messages,
        response_format: { type: "json_object" },
        enable_thinking: false,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(errorBody?.message ?? `AI API error: ${response.status}`);
    }

    const data = await response.json() as QwenTextResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI returned empty response.");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Calls Alibaba Qwen LLM for plain text chat (no JSON format forced).
 */
export async function callQwenChat(messages: QwenMessage[], timeoutMs = 30_000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${serverEnv.alibabaBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverEnv.alibabaApiKey}`,
      },
      body: JSON.stringify({
        model: serverEnv.alibabaTextModel,
        messages,
        enable_thinking: false,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(errorBody?.message ?? `AI Chat API error: ${response.status}`);
    }

    const data = await response.json() as QwenTextResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI returned empty chat response.");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Image Generation (Qwen Image 3.0) ──────────────────────────────────────

type QwenImageResponse = {
  output: {
    choices: Array<{
      finish_reason: string;
      message: {
        role: string;
        content: Array<{ image?: string }>;
      };
    }>;
  };
  request_id: string;
};

/**
 * Generates an image from a text prompt using Qwen Image 3.0 Pro.
 * Returns the temporary image URL (valid for 24 hours).
 */
export async function generateQwenImage(prompt: string, size = "1024*1024", timeoutMs = 120_000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(serverEnv.alibabaImageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverEnv.alibabaApiKey}`,
      },
      body: JSON.stringify({
        model: serverEnv.alibabaImageModel,
        input: {
          messages: [
            {
              role: "user",
              content: [{ text: prompt }],
            },
          ],
        },
        parameters: {
          prompt_extend: true,
          size,
          watermark: false,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(errorBody?.message ?? `Image API error: ${response.status}`);
    }

    const data = await response.json() as QwenImageResponse;
    const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;
    if (!imageUrl) throw new Error("Image generation returned no URL.");
    return imageUrl;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Downloads an image from a URL and converts it to a File object.
 * Used to re-upload AI-generated images to the Go backend as FormData.
 */
export async function downloadImageAsFile(imageUrl: string, filename = "ai-thumbnail.png"): Promise<File> {
  const response = await fetch(imageUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to download AI-generated image.");
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
}
