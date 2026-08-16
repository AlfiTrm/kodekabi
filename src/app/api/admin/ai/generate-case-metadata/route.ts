import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { callQwenText } from "@/src/features/admin/ai-generation/services/alibaba-ai-service";
import type { GenerateCaseMetadataRequest, GenerateCaseMetadataResponse } from "@/src/features/admin/ai-generation/types/ai-generation";

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

const STYLE_ANCHOR = `Flat illustration style, muted dark palette with one accent color per theme, minimalist, editorial-style, no photorealistic faces, consistent with a modern digital-investigation game aesthetic — Kota Nusa universe.`;

const SHARED_CONSTITUTION = `Kamu membantu tim KODEKABI: Jejak Algoritma menyusun konten case investigasi literasi digital. Semesta cerita: Kota Nusa, kota virtual fiktif. SELURUH entitas (nama orang, media, akun, platform, institusi) HARUS fiktif — dilarang menyebut entitas nyata. Output HARUS JSON valid, tanpa teks lain, tanpa markdown fence, tanpa komentar pembuka/penutup.`;

const METADATA_SYSTEM_PROMPT = `${SHARED_CONSTITUTION}

TUGASMU
Hasilkan metadata untuk SATU case baru dalam format JSON, mengikuti struktur berikut:

{
  "title": string,
  "short_description": string (maks 500 karakter, sinopsis singkat kasus),
  "theme_tags": array of string,
  "risk_level": "low" | "medium" | "high",
  "estimated_duration_minutes": integer (5-15),
  "unlock_requirement": {
    "min_level": integer,
    "min_reputation": integer,
    "prerequisite_case_ids": array of string (boleh kosong)
  },
  "thumbnail_prompt": string
}

ATURAN THUMBNAIL_PROMPT
thumbnail_prompt WAJIB diisi, dibangun dari STYLE ANCHOR TETAP berikut digabung 2-3 kalimat deskripsi spesifik case ini:

STYLE ANCHOR TETAP (salin persis):
"${STYLE_ANCHOR}"

Jangan tulis apa pun di luar objek JSON.`;

export async function POST(request: NextRequest): Promise<NextResponse<GenerateCaseMetadataResponse>> {
  // Auth guard
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken || !verifyAdminToken(accessToken)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: GenerateCaseMetadataRequest;
  try {
    body = await request.json() as GenerateCaseMetadataRequest;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { theme, theme_other_text, competency_focus, difficulty } = body;

  const validThemes = ["misleading_health_advice","chatbot_hallucination","clickbait_headline","statistic_out_of_context","forum_misinformation","viral_conflict_content","algorithmic_echo_chamber","other"];
  const validCompetencies = ["evidence_evaluation","claim_analysis","confidence_calibration","reasoning","safety_judgment"];
  const validDifficulties = ["low","medium","high"];

  if (!validThemes.includes(theme)) {
    return NextResponse.json({ success: false, error: "Nilai tema tidak valid." }, { status: 400 });
  }
  if (!validCompetencies.includes(competency_focus)) {
    return NextResponse.json({ success: false, error: "Nilai kompetensi tidak valid." }, { status: 400 });
  }
  if (!validDifficulties.includes(difficulty)) {
    return NextResponse.json({ success: false, error: "Nilai kesulitan tidak valid." }, { status: 400 });
  }
  if (theme === "other" && !theme_other_text?.trim()) {
    return NextResponse.json({ success: false, error: "Deskripsi tema 'lainnya' wajib diisi." }, { status: 400 });
  }

  const themeLabel = theme === "other" ? (theme_other_text ?? "") : theme;
  const taskPrompt = `Buatkan metadata case baru dengan parameter berikut:
- Tema: ${themeLabel}
- Fokus kompetensi utama: ${competency_focus}
- Tingkat kesulitan: ${difficulty}`;

  try {
    const rawJson = await callQwenText([
      { role: "system", content: METADATA_SYSTEM_PROMPT },
      { role: "user", content: taskPrompt },
    ]);

    const metadata = JSON.parse(rawJson) as Record<string, unknown>;

    // Basic validation
    if (typeof metadata.title !== "string" || !metadata.title) {
      return NextResponse.json({ success: false, error: "AI menghasilkan metadata yang tidak valid. Coba lagi." }, { status: 502 });
    }

    return NextResponse.json({ success: true, metadata: metadata as never });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation gagal.";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
