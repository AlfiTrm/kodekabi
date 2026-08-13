"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminGameLevel } from "../services/admin-game-levels-service";
import type { AdminGameLevelActionState } from "../types/admin-game-level";

export async function deleteAdminGameLevelAction(_state: AdminGameLevelActionState, formData: FormData): Promise<AdminGameLevelActionState> {
  const levelId = String(formData.get("game_level_id") ?? "");
  if (!levelId) return { error: "ID level tidak ditemukan." };
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    await deleteAdminGameLevel(levelId, token);
    revalidatePath("/admin/config");
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : "Level gagal dihapus. Coba lagi." };
  }
  redirect("/admin/config?tab=xp-level");
}
