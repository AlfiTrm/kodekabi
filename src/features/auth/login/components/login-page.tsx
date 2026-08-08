"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/src/shared/components/ui/button";
import { GoogleIcon } from "../../_shared/components/google-icon";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-24 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute left-[15%] top-20 h-32 w-24 rotate-[-12deg] rounded-2xl bg-red/55" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[15%] top-24 h-32 w-24 rotate-[10deg] rounded-2xl bg-blue/55" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-16 left-[22%] h-32 w-24 rotate-[8deg] rounded-2xl bg-green/55" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-12 right-[21%] h-32 w-24 rotate-[-10deg] rounded-2xl bg-orange-shadow/70" />

      <section className="relative z-10 w-full max-w-[460px] rounded-3xl border border-border bg-surface px-8 pb-8 pt-14 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-9">
        <Image src="/mascot/mascot-jacket-peace.webp" alt="Maskot KODEKABI" width={260} height={330} priority className="pointer-events-none absolute -top-28 left-1/2 h-auto w-32 -translate-x-1/2 sm:w-36" />

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-[-0.04em] sm:text-3xl">Eh, balik lagi!</h1>
          <p className="mt-2 text-xs text-foreground/50">Kasus harianmu belum disentuh hari ini.</p>
        </div>

        <form className="mt-6 space-y-4">
          <label className="block text-[10px] font-semibold text-foreground">
            Email atau username
            <input type="text" name="username" autoComplete="username" placeholder="nadi_audit" className="mt-2 h-10 w-full rounded-xl border border-border-strong bg-background px-3 text-xs text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-orange" />
          </label>

          <label className="block text-[10px] font-semibold text-foreground">
            <span className="flex items-center justify-between">Password<Link href="#forgot-password" className="font-normal text-purple transition-opacity hover:opacity-75">Lupa password?</Link></span>
            <span className="relative mt-2 block">
              <input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" defaultValue="password123" className="h-10 w-full rounded-xl border border-border-strong bg-background px-3 pr-14 text-xs text-foreground outline-none transition-colors focus:border-orange" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-3 text-[10px] font-normal text-purple hover:opacity-75">{showPassword ? "Sembunyikan" : "Lihat"}</button>
            </span>
          </label>

          <button type="submit" className="h-10 w-full rounded-full bg-white text-sm font-semibold text-button-ink transition-colors duration-300 hover:bg-orange">Lanjut Main</button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.16em] text-foreground/35">
          <span className="h-px flex-1 bg-border" />atau<span className="h-px flex-1 bg-border" />
        </div>

        <Button href="#google" variant="outline" className="w-full gap-2"><GoogleIcon />Lanjut dengan Google</Button>
        <p className="mt-4 text-center text-[10px] text-foreground/40">Pemain baru? <Link href="/register" className="text-purple hover:opacity-75">Buat akun</Link></p>
      </section>
    </main>
  );
}
