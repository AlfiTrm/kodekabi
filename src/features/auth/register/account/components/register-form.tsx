"use client";

import Link from "next/link";

import { Button } from "@/src/shared/components/ui/button";
import { GoogleIcon } from "../../../_shared/components/google-icon";
import { useRegisterAccount } from "../hooks/use-register-account";

export function RegisterForm() {
  const { state, action, pending, email, password, showPassword, canSubmit, setEmail, setPassword, setShowPassword } = useRegisterAccount();

  return (
    <div className="w-full max-w-[440px]">
      <h2 className="font-display text-3xl font-bold uppercase tracking-[-0.04em]">Daftar<span className="text-red">.</span></h2>

      <form className="mt-8 space-y-4" action={action}>
        <label className="block text-[10px] font-semibold">
          Email
          <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="kabitektif@gmail.com" required className="mt-2 h-10 w-full rounded-xl border border-border-strong bg-surface px-3 text-xs outline-none transition-colors placeholder:text-foreground/45 focus:border-purple" />
        </label>

        <label className="block text-[10px] font-semibold">
          Password
          <span className="relative mt-2 block">
            <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="Minimal 8 karakter" minLength={8} required className="h-10 w-full rounded-xl border border-border-strong bg-surface px-3 pr-14 text-xs outline-none transition-colors placeholder:text-foreground/45 focus:border-purple" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 cursor-pointer text-[10px] font-normal text-purple hover:opacity-75">{showPassword ? "Sembunyikan" : "Lihat"}</button>
          </span>
        </label>

        <div className="flex gap-1 pt-0.5" aria-label="Kekuatan password">
          {[1, 2, 3].map((item) => <span key={item} className={`h-1 flex-1 rounded-full ${password.length >= item * 3 ? "bg-green" : "bg-border"}`} />)}
          <span className="h-1 flex-1 rounded-full bg-border" />
          <span className="ml-1 text-[8px] font-bold text-green">{password.length >= 8 ? "cukup" : ""}</span>
        </div>

        {state.error ? <p role="alert" className="rounded-xl border border-red/35 bg-red/10 px-3 py-2 text-[10px] text-red">{state.error}</p> : null}
        <button type="submit" disabled={!canSubmit} className="mt-3 h-10 w-full cursor-pointer rounded-full bg-white text-sm font-semibold text-button-ink transition-colors duration-300 enabled:hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35">{pending ? "Mengirim kode..." : "Kirim Kode Verifikasi"}</button>
      </form>

      <div className="my-4 flex items-center gap-3 text-[8px] uppercase tracking-[0.16em] text-foreground/35"><span className="h-px flex-1 bg-border" />atau pakai Google<span className="h-px flex-1 bg-border" /></div>
      <Button href="#google" variant="outline" className="w-full gap-2"><GoogleIcon />Lanjut dengan Google</Button>
      <p className="mt-5 text-center text-[10px] text-foreground/40">Dengan mendaftar kamu setuju dengan <Link href="#terms" className="text-purple hover:opacity-75">aturan main & privasi</Link>.</p>
      <p className="mt-4 text-center text-[10px] text-foreground/40">Sudah punya akun? <Link href="/login" className="text-purple hover:opacity-75">Masuk</Link></p>
    </div>
  );
}
