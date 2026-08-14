"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { AuthInput } from "../../_shared/components/auth-input";
import { userLoginAction } from "../actions/user-login-action";

const initialState = { error: null };

export function UserLoginForm() {
  const [state, formAction, pending] = useActionState(userLoginAction, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <AuthInput
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        placeholder="kabitektif@gmail.com"
        required
        disabled={pending}
        invalid={Boolean(state.error)}
      />
      <AuthInput
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        placeholder="Masukkan password"
        required
        disabled={pending}
        invalid={Boolean(state.error)}
        labelAction={<Link href="#forgot-password" className="text-[10px] font-normal text-purple transition-opacity hover:opacity-75">Lupa password?</Link>}
        endAdornment={<button type="button" disabled={pending} onClick={() => setShowPassword((visible) => !visible)} className="cursor-pointer text-[10px] font-normal text-purple transition-opacity hover:opacity-75 disabled:cursor-not-allowed">{showPassword ? "Sembunyikan" : "Lihat"}</button>}
      />

      {state.error ? <p role="alert" className="rounded-lg border border-red/25 bg-red/8 px-3 py-2 text-[10px] leading-relaxed text-red">{state.error}</p> : null}

      <button type="submit" disabled={!canSubmit || pending} className="mt-3 h-11 w-full cursor-pointer rounded-full bg-white text-sm font-semibold text-button-ink transition-colors duration-300 enabled:hover:bg-blue disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35">
        {pending ? "Membuka berkas..." : "Lanjut Main"}
      </button>
    </form>
  );
}
