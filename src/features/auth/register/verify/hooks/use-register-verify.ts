"use client";

import { useActionState, useState } from "react";
import { verifyRegistrationAction } from "../../_shared/actions/register-actions";

export function useRegisterVerify() {
  const [state, action, pending] = useActionState(verifyRegistrationAction, {});
  const [code, setCode] = useState(() => Array<string>(6).fill(""));
  return { state, action, pending, code, setCode, isComplete: code.every(Boolean) };
}
