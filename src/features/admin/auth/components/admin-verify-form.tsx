"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { OtpInput } from "@/src/features/auth/_shared/components/otp-input";
import { adminVerifyAction } from "../actions/admin-verify-action";

const OTP_LENGTH = 6;
const initialState = { error: null };

type AdminVerifyFormProps = {
  email: string;
  initialSeconds: number;
  expiresAt?: number;
};

function formatRemainingTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function AdminVerifyForm({ email, initialSeconds, expiresAt }: AdminVerifyFormProps) {
  const [state, formAction, pending] = useActionState(adminVerifyAction, initialState);
  const [digits, setDigits] = useState(() => Array<string>(OTP_LENGTH).fill(""));
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const formRef = useRef<HTMLFormElement>(null);
  const autoSubmittedCodeRef = useRef("");
  const deadlineRef = useRef(0);
  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;
  const isExpired = remainingSeconds === 0;

  useEffect(() => {
    deadlineRef.current = expiresAt ?? Date.now() + initialSeconds * 1000;
    const timer = window.setInterval(() => {
      const nextRemaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);
      if (nextRemaining === 0) window.clearInterval(timer);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt, initialSeconds]);

  useEffect(() => {
    if (!isComplete || isExpired || pending || autoSubmittedCodeRef.current === code) return;

    autoSubmittedCodeRef.current = code;
    formRef.current?.requestSubmit();
  }, [code, isComplete, isExpired, pending]);

  return (
    <form ref={formRef} action={formAction} className="mt-7">
      <input type="hidden" name="code" value={code} />
      <OtpInput value={digits} onChange={setDigits} size="compact" tone="orange" disabled={pending || isExpired} />

      <div className="mt-4 flex items-center justify-between gap-4 text-[9px] text-foreground/35">
        <span className={isExpired ? "text-red" : undefined}>{isExpired ? "Kode kedaluwarsa" : `Berlaku · ${formatRemainingTime(remainingSeconds)}`}</span>
        <Link href="/admin/login" className="text-foreground/45 transition-colors hover:text-orange">Kirim ulang kode</Link>
      </div>

      <button
        type="submit"
        disabled={!isComplete || pending || isExpired}
        className="mt-5 h-11 w-full cursor-pointer rounded-full bg-white text-sm font-semibold text-button-ink transition-colors duration-300 enabled:hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35"
      >
        {pending ? "Memverifikasi..." : "Verifikasi"}
      </button>

      {state.error ? <p role="alert" className="mt-4 rounded-xl border border-red/30 bg-red/8 px-3 py-2.5 text-[10px] leading-relaxed text-red">{state.error}</p> : null}

      <div className="mt-5 rounded-xl border border-red/25 bg-red/8 px-3 py-2.5 text-[9px] leading-relaxed text-red/85">
        Maksimum 5 percobaan. Akun akan dikunci 15 menit setelah percobaan terlampaui.
      </div>

      <p className="mt-5 text-center text-[9px] text-foreground/35">Kode dikirim ke <span className="text-foreground/60">{email}</span></p>
    </form>
  );
}
