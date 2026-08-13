import { ApiError } from "@/src/shared/services/api/api-error";
import type { AdminGameLevelPayload } from "../types/admin-game-level";

export function readGameLevelPayload(formData: FormData): AdminGameLevelPayload | null {
  const rawLevel = String(formData.get("level") ?? "").trim();
  const rawXpRequired = String(formData.get("xp_required") ?? "").trim();
  const rawRewardCoin = String(formData.get("reward_coin") ?? "").trim();
  const level = Number(rawLevel);
  const xpRequired = Number(rawXpRequired);
  const rewardCoin = Number(rawRewardCoin);
  const title = String(formData.get("title") ?? "").trim();

  if (!rawLevel || !rawXpRequired || !rawRewardCoin || !Number.isInteger(level) || level < 1 || !Number.isInteger(xpRequired) || xpRequired < 0 || !Number.isInteger(rewardCoin) || rewardCoin < 0 || !title) return null;
  return { level, xp_required: xpRequired, title, reward_coin: rewardCoin };
}

export function gameLevelActionError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 409) return "Nomor level sudah digunakan. Pilih level lain.";
    return error.message;
  }
  return "Konfigurasi level gagal disimpan. Coba lagi.";
}
