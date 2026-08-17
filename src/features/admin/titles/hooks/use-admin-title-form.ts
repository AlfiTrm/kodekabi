"use client";

import { useState } from "react";

import type { AdminTitle } from "../types/admin-title";

export function useAdminTitleForm(title?: AdminTitle) {
  const [name, setName] = useState(title?.title ?? "");
  const [unlockLevel, setUnlockLevel] = useState(title ? String(title.unlock_level) : "1");
  const [status, setStatus] = useState(title?.status ?? "active");

  const valid = Boolean(name.trim() && unlockLevel !== "" && Number(unlockLevel) >= 0);

  return {
    values: { name, unlockLevel, status },
    setters: { setName, setUnlockLevel, setStatus },
    valid,
  };
}
