"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { createAdminGameLevel } from "../services/admin-game-levels-service";
import type { AdminGameLevelActionState } from "../types/admin-game-level";
import { gameLevelActionError, readGameLevelPayload } from "./game-level-action-utils";

export async function createAdminGameLevelAction(_state: AdminGameLevelActionState, formData: FormData): Promise<AdminGameLevelActionState> {
  const payload = readGameLevelPayload(formData);
  if (!payload) return { error: "Lengkapi level, kebutuhan XP, gelar, dan reward dengan nilai yang valid." };
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    await createAdminGameLevel(payload, token);
    revalidatePath("/admin/config");
  } catch (error) {
    return { error: gameLevelActionError(error) };
  }
  redirect("/admin/config?tab=xp-level");
}
