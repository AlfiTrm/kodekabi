"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/src/shared/components/ui/button";
import { GoogleIcon } from "../../_shared/components/google-icon";
import { UserLoginForm } from "./user-login-form";

export function LoginPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[46%_54%]">
      <section className="flex min-h-dvh items-center justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="w-full max-w-[420px]">
          <Link href="/" aria-label="KODEKABI Beranda" className="mb-14 inline-flex lg:hidden">
            <Image src="/logo/logo-horizontal.svg" alt="KODEKABI" width={169} height={40} className="h-auto w-36" priority />
          </Link>

          <h1 className="font-display text-3xl font-bold uppercase tracking-[-0.04em] sm:text-4xl">
            Masuk<span className="text-red">.</span>
          </h1>

          <UserLoginForm />

          <div className="my-5 flex items-center gap-3 text-[9px] uppercase tracking-[0.16em] text-foreground/35">
            <span className="h-px flex-1 bg-border" />atau pakai Google<span className="h-px flex-1 bg-border" />
          </div>

          <Button href="#google" variant="outline" className="w-full gap-2"><GoogleIcon />Lanjut dengan Google</Button>
          <p className="mt-5 text-center text-[10px] text-foreground/40">Pemain baru? <Link href="/register" className="text-purple hover:opacity-75">Buat akun</Link></p>
        </div>
      </section>

      <aside className="relative hidden min-h-dvh overflow-hidden bg-blue px-10 py-10 text-white lg:block xl:px-16">
        <Link href="/" aria-label="KODEKABI Beranda" className="relative z-20 inline-flex">
          <Image src="/logo/logo-horizontal.svg" alt="KODEKABI" width={169} height={40} className="h-auto w-[145px]" priority />
        </Link>

        <div className="relative z-10 mt-32 max-w-md xl:mt-40">
          <h2 className="font-display text-5xl font-bold uppercase leading-[0.94] tracking-[-0.04em] xl:text-6xl">
            Eh,<br />balik lagi<span className="text-[#17213a]">!</span>
          </h2>
          <p className="mt-5 max-w-sm text-xs leading-relaxed text-white/85">Kasus harianmu belum disentuh hari ini. Kota Nusa sudah menunggumu kembali.</p>
        </div>

        <Image src="/mascot/mascot-jacket-peace.webp" alt="Maskot KODEKABI" width={520} height={650} priority className="pointer-events-none absolute -bottom-[2%] right-[-2%] z-10 h-auto w-[58%] max-w-[560px]" />

        <div className="absolute bottom-10 left-10 z-20 flex gap-2 xl:left-16">
          <span className="rounded-full border border-white/20 bg-black/15 px-4 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">36K+ PEMAIN</span>
          <span className="rounded-full border border-white/20 bg-black/15 px-4 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">GRATIS</span>
        </div>
      </aside>
    </main>
  );
}
