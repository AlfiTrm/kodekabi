"use client";

import { useState } from "react";
import type { AdminGameLevel } from "../types/admin-game-level";

export function useAdminGameLevelForm(level?: AdminGameLevel) {
  const [levelNumber, setLevelNumber] = useState(level ? String(level.level) : "");
  const [xpRequired, setXpRequired] = useState(level ? String(level.xp_required) : "");
  const [title, setTitle] = useState(level?.title ?? "");
  const [rewardCoin, setRewardCoin] = useState(level ? String(level.reward_coin) : "");

  const valid = levelNumber.trim() !== "" && xpRequired.trim() !== "" && rewardCoin.trim() !== ""
    && Number.isInteger(Number(levelNumber)) && Number(levelNumber) > 0
    && Number.isInteger(Number(xpRequired)) && Number(xpRequired) >= 0
    && title.trim().length > 0
    && Number.isInteger(Number(rewardCoin)) && Number(rewardCoin) >= 0;
  const dirty = !level || Number(levelNumber) !== level.level || Number(xpRequired) !== level.xp_required
    || title.trim() !== level.title || Number(rewardCoin) !== level.reward_coin;

  return {
    values: { levelNumber, xpRequired, title, rewardCoin },
    setters: { setLevelNumber, setXpRequired, setTitle, setRewardCoin },
    valid,
    dirty,
  };
}
