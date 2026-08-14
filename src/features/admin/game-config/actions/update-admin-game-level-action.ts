"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminGameLevel } from "../services/admin-game-levels-service";
import type { AdminGameLevelActionState } from "../types/admin-game-level";
import { gameLevelActionError, readGameLevelPayload } from "./game-level-action-utils";

export async function updateAdminGameLevelAction(_state: AdminGameLevelActionState, formData: FormData): Promise<AdminGameLevelActionState> {
  const levelId = String(formData.get("game_level_id") ?? "");
  const payload = readGameLevelPayload(formData);
  if (!levelId || !payload) return { error: "Data level tidak lengkap atau tidak valid." };
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    await updateAdminGameLevel(levelId, payload, token);
    revalidatePath("/admin/config");
  } catch (error) {
    return { error: gameLevelActionError(error) };
  }
  redirect("/admin/config?tab=xp-level");
}
