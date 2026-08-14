"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { saveAdminGeneralGameConfig } from "../services/admin-game-config-service";
import type { AdminGeneralGameConfigActionState } from "../types/admin-game-config";

function readPositiveNumber(formData: FormData, field: string) {
  const value = Number(formData.get(field));
  return Number.isFinite(value) && value > 0 ? value : null;
}

export async function saveAdminGeneralConfigAction(
  _state: AdminGeneralGameConfigActionState,
  formData: FormData,
): Promise<AdminGeneralGameConfigActionState> {
  const maxCasesPerDay = readPositiveNumber(formData, "max_cases_per_day");
  const cooldownMinutes = readPositiveNumber(formData, "cooldown_between_cases_minutes");
  const streakMultiplier = readPositiveNumber(formData, "streak_bonus_multiplier");

  if (maxCasesPerDay === null || !Number.isInteger(maxCasesPerDay)) {
    return { error: "Batas case harian harus berupa bilangan bulat lebih dari 0.", success: null, config: null };
  }
  if (cooldownMinutes === null || !Number.isInteger(cooldownMinutes)) {
    return { error: "Cooldown harus berupa jumlah menit bulat lebih dari 0.", success: null, config: null };
  }
  if (streakMultiplier === null) {
    return { error: "Multiplier streak harus berupa angka lebih dari 0.", success: null, config: null };
  }

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    const config = await saveAdminGeneralGameConfig({
      max_cases_per_day: maxCasesPerDay,
      cooldown_between_cases_minutes: cooldownMinutes,
      streak_bonus_multiplier: streakMultiplier,
      maintenance_mode: formData.get("maintenance_mode") === "true",
    }, accessToken);
    revalidatePath("/admin/config");
    return { error: null, success: "Konfigurasi general berhasil disimpan.", config };
  } catch (error) {
    return {
      error: error instanceof ApiError ? error.message : "Konfigurasi gagal disimpan. Coba lagi.",
      success: null,
      config: null,
    };
  }
}
