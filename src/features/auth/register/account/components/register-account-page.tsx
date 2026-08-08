import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "./register-form";

export function RegisterAccountPage() {
  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[3fr_2fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-purple px-10 py-10 text-foreground lg:block xl:px-16">
        <Link href="/" aria-label="KODEKABI Beranda" className="relative z-10 inline-flex items-center">
          <Image src="/logo/logo-horizontal.svg" alt="KODEKABI" width={169} height={40} className="h-auto w-[145px]" />
        </Link>

        <div className="relative z-10 mt-32 max-w-2xl">
          <h1 className="font-display text-5xl font-bold uppercase tracking-[-0.04em] xl:text-6xl">Kota Nusa butuh<br />auditor baru<span className="text-button-ink">.</span></h1>
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-foreground/75">Kasus pertamamu sudah disiapkan. Kabi menunggu di lobi.</p>
        </div>

        <Image src="/mascot/mascot-jacket-key.webp" alt="Maskot KODEKABI" width={420} height={520} priority className="absolute bottom-[-14%] right-[2%] w-[60%] max-w-[630px] min-w-[390px]" />

        <div className="absolute bottom-10 left-10 flex gap-2 xl:left-16">
          <span className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[10px] font-bold text-foreground backdrop-blur-md">36K+ PEMAIN</span>
          <span className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[10px] font-bold text-foreground backdrop-blur-md">GRATIS</span>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-20 sm:px-10">
        <RegisterForm />
      </section>
    </main>
  );
}
