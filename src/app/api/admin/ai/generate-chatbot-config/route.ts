import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { callQwenText } from "@/src/features/admin/ai-generation/services/alibaba-ai-service";
import type { ChatbotConfigResponse } from "@/src/features/admin/cases/services/admin-cases-service";

function verifyAdminToken(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { IsAdmin?: boolean; is_admin?: boolean; RoleName?: string; role_name?: string; role?: string; exp?: number };
    const role = claims.RoleName ?? claims.role_name ?? claims.role;
    const isExpired = typeof claims.exp === "number" && claims.exp * 1000 <= Date.now();
    return !isExpired && (claims.IsAdmin === true || claims.is_admin === true || role?.toLowerCase() === "admin");
  } catch {
    return false;
  }
}

const SHARED_CONSTITUTION = `Kamu membantu tim KODEKABI: Jejak Algoritma menyusun konten case investigasi literasi digital. Semesta cerita: Kota Nusa, kota virtual fiktif. SELURUH entitas (nama orang, media, akun, platform, institusi) HARUS fiktif — dilarang menyebut entitas nyata. Output HARUS JSON valid, tanpa teks lain, tanpa markdown fence, tanpa komentar pembuka/penutup.`;

const SYSTEM_PROMPT = `${SHARED_CONSTITUTION}

TUGASMU:
Hasilkan konfigurasi chatbot untuk sebuah game simulasi investigasi berdasarkan judul dan deskripsi kasus yang diberikan.
Output HARUS berformat JSON dengan struktur berikut:

{
  "bot_name": string,
  "bot_persona_description": string,
  "knowledge_boundary": string,
  "prohibited_behaviors": array of string (3-5 larangan yang relevan),
  "suggested_questions": array of string (3-5 pertanyaan panduan untuk pemain)
}

Contoh bot_name: "Bot_HerbalAjaib_v4.1", "Admin_Sistem_KotaNusa", dsb.
Buat agar persona chatbot tersebut menarik dan relevan dengan kasus misterinya.`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken || !verifyAdminToken(accessToken)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: { title: string; short_description: string };
  try {
    body = await request.json() as { title: string; short_description: string };
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { title, short_description } = body;
  if (!title || !short_description) {
    return NextResponse.json({ success: false, error: "Title and description are required." }, { status: 400 });
  }

  const taskPrompt = `Judul Case: ${title}\nDeskripsi Singkat: ${short_description}\n\nBuatkan konfigurasi chatbot JSON untuk kasus ini.`;

  try {
    const rawJson = await callQwenText([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: taskPrompt },
    ]);

    const metadata = JSON.parse(rawJson) as ChatbotConfigResponse;

    if (!metadata.bot_name || !metadata.bot_persona_description) {
      return NextResponse.json({ success: false, error: "AI menghasilkan output tidak valid." }, { status: 502 });
    }

    return NextResponse.json({ success: true, config: metadata });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation gagal.";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
