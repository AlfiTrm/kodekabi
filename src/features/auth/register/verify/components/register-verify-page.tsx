"use client";

import Link from "next/link";
import { AuthHeader } from "../../../_shared/components/auth-header";
import { OtpInput } from "../../../_shared/components/otp-input";
import { useRegisterVerify } from "../hooks/use-register-verify";

export function RegisterVerifyPage({ email, verified = false }: { email: string; verified?: boolean }) {
  const { state, action, pending, code, setCode, isComplete } = useRegisterVerify();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthHeader currentStep={1} backHref="/register?review=account" />
      <section className="mx-auto flex max-w-[620px] flex-col items-center px-6 pb-16 pt-14 text-center sm:pt-20">
        <div className="relative [perspective:700px]">
          <div className="flex size-20 items-center justify-center rounded-[1.65rem] border-2 border-blue bg-blue/20"><span aria-hidden="true" className="inline-block animate-[verify-envelope-wiggle_2.8s_ease-in-out_infinite] text-5xl leading-none grayscale brightness-70 invert">✉️</span></div>
          <span className="absolute -right-3 -top-3 flex size-10 rotate-[7deg] animate-[verify-question-wiggle_2.8s_ease-in-out_infinite] items-center justify-center rounded-full bg-red font-display text-2xl font-bold text-button-ink shadow-[0_8px_18px_rgba(242,109,109,0.2)]">?</span>
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold uppercase tracking-[-0.04em]">Cek email kamu<span className="text-purple">.</span></h1>
        <p className="mt-2 max-w-sm text-[10px] leading-relaxed text-foreground/55">Kode 6 digit sudah terbang ke {email}<br />Langkah 2 dari 4 - berlaku 10 menit.</p>

        {verified ? (
          <div className="mt-7 w-full max-w-sm rounded-2xl border border-green/35 bg-green/10 p-5">
            <p className="text-xs font-semibold text-green">Email sudah terverifikasi.</p>
            <Link href="/register/detective" className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-button-ink transition-colors hover:bg-orange">Lanjut ke detektif</Link>
          </div>
        ) : (
          <form action={action} className="mt-7 w-fit">
            <OtpInput value={code} onChange={setCode} disabled={pending} />
            <input type="hidden" name="code" value={code.join("")} />
            {state.error ? <p role="alert" className="mt-4 rounded-xl border border-red/35 bg-red/10 px-3 py-2 text-[10px] text-red">{state.error}</p> : null}
            <button type="submit" disabled={!isComplete || pending} className="mt-5 h-10 w-full cursor-pointer rounded-full bg-white text-sm font-semibold text-button-ink transition-colors enabled:hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/45">{pending ? "Memeriksa..." : "Verifikasi"}</button>
          </form>
        )}

        <p className="mt-5 text-[10px] text-foreground/55">Belum masuk? Cek folder spam, atau</p>
        <p className="mt-2 text-[10px] text-foreground/55">Kode berlaku selama sesi registrasi aktif.</p>
        <Link href="/register?review=account" className="mt-3 text-[10px] text-purple hover:opacity-75">Ganti alamat email</Link>
      </section>
    </main>
  );
}
