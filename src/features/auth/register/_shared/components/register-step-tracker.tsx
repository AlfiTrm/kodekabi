"use client";

import { useEffect } from "react";

import { REGISTER_ACTIVE_STEP_STORAGE } from "../constants/register-auth";

export function RegisterStepTracker({ step }: { step: number }) {
  useEffect(() => {
    sessionStorage.setItem(REGISTER_ACTIVE_STEP_STORAGE, String(step));
  }, [step]);

  return null;
}
