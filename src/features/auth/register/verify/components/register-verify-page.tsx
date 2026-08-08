"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/src/shared/components/ui/button";
import { AuthHeader } from "../../../_shared/components/auth-header";
import { OtpInput } from "../../../_shared/components/otp-input";
import { useRegisterSession } from "../../_shared/register-session-context";

const OTP_LENGTH = 6;

export function RegisterVerifyPage() {
  const { draft } = useRegisterSession();
  const [code, setCode] = useState(() => Array<string>(OTP_LENGTH).fill(""));
  const isComplete = code.every(Boolean);
  const destinationEmail = draft.email || "kabitektif@gmail.com";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthHeader currentStep={1} backHref="/register" />
      <section className="mx-auto flex max-w-[620px] flex-col items-center px-6 pb-16 pt-14 text-center sm:pt-20">
        <div className="relative [perspective:700px]">
          <div className="flex size-20 items-center justify-center rounded-[1.65rem] border-2 border-blue bg-blue/20">
            <span aria-hidden="true" className="inline-block animate-[verify-envelope-wiggle_2.8s_ease-in-out_infinite] text-5xl leading-none grayscale brightness-70 invert">✉️</span>
          </div>
          <span className="absolute -right-3 -top-3 flex size-10 rotate-[7deg] animate-[verify-question-wiggle_2.8s_ease-in-out_infinite] items-center justify-center rounded-full bg-red font-display text-2xl font-bold text-button-ink shadow-[0_8px_18px_rgba(242,109,109,0.2)]">?</span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold uppercase tracking-[-0.04em]">Cek email kamu<span className="text-purple">.</span></h1>
        <p className="mt-2 max-w-sm text-[10px] leading-relaxed text-foreground/55">Kode 6 digit sudah terbang ke {destinationEmail}<br />Langkah 2 dari 4 - berlaku 10 menit.</p>

        <div className="mt-7 w-fit">
          <OtpInput value={code} onChange={setCode} />
          <Button href="/register/detective" variant="solid" disabled={!isComplete} className="mt-5 w-full" size="compact">Verifikasi</Button>
        </div>

        <p className="mt-5 text-[10px] text-foreground/55">Belum masuk? Cek folder spam, atau</p>
        <p className="mt-2 text-[10px] text-foreground/55">Kirim ulang dalam <span className="rounded-full bg-surface-elevated px-2 py-1 font-mono text-foreground">00:42</span></p>
        <Link href="/register" className="mt-3 text-[10px] text-purple hover:opacity-75">Ganti alamat email</Link>
      </section>
    </main>
  );
}
