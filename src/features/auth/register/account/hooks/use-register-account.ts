"use client";

import { useActionState, useState } from "react";
import { startRegistrationAction } from "../../_shared/actions/register-actions";
import { useRegisterSession } from "../../_shared/register-session-context";

export function useRegisterAccount() {
  const { draft, updateDraft } = useRegisterSession();
  const [state, action, pending] = useActionState(startRegistrationAction, {});
  const [email, setEmailState] = useState(draft.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return {
    state, action, pending, email, password, showPassword, setPassword, setShowPassword,
    canSubmit: email.trim().length > 0 && password.length >= 8 && !pending,
    setEmail(next: string) { setEmailState(next); updateDraft({ email: next.trim() }); },
  };
}
