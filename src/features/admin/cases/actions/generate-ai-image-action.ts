"use server";

import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { generateQwenImage } from "@/src/features/admin/ai-generation/services/alibaba-ai-service";

export async function generateAiImageAction(prompt: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return { error: "Unauthorized" };
  }

  try {
    const imageUrl = await generateQwenImage(prompt);
    
    // Download image as buffer to avoid CORS on client
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Gagal mendownload gambar hasil AI.");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    
    return { 
      success: true, 
      base64,
      mimeType: response.headers.get("content-type") || "image/png"
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Terjadi kesalahan saat generate gambar AI." };
  }
}
