import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { generateQwenImage } from "@/src/features/admin/ai-generation/services/alibaba-ai-service";
import type { GenerateThumbnailResponse } from "@/src/features/admin/ai-generation/types/ai-generation";

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

export async function POST(request: NextRequest): Promise<NextResponse<GenerateThumbnailResponse>> {
  // Auth guard
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken || !verifyAdminToken(accessToken)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: { thumbnail_prompt: string };
  try {
    body = await request.json() as { thumbnail_prompt: string };
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { thumbnail_prompt } = body;

  if (!thumbnail_prompt?.trim()) {
    return NextResponse.json({ success: false, error: "thumbnail_prompt wajib diisi." }, { status: 400 });
  }

  if (thumbnail_prompt.length > 4000) {
    return NextResponse.json({ success: false, error: "Prompt terlalu panjang (maks 4000 karakter)." }, { status: 400 });
  }

  try {
    const imageUrl = await generateQwenImage(thumbnail_prompt, "1024*1024");
    return NextResponse.json({ success: true, image_url: imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation gagal.";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
