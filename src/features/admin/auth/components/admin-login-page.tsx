import Image from "next/image";

import { AdminLoginForm } from "./admin-login-form";

export function AdminLoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-5 py-12 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_42%,rgba(242,109,109,0.12),transparent_31%),radial-gradient(circle_at_76%_62%,rgba(131,117,232,0.12),transparent_34%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple/45 to-transparent" />

      <section className="relative z-10 w-full max-w-[400px] rounded-3xl border border-border bg-surface px-7 py-8 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:px-9 sm:py-10">
        <div className="text-center">
          <Image src="/logo/logo-icon.svg" alt="KODEKABI" width={42} height={42} priority className="mx-auto size-10" />
          <h1 className="mt-5 font-display text-2xl font-semibold uppercase tracking-[-0.025em] sm:text-3xl">
            Admin Console<span className="text-red">.</span>
          </h1>
          <p className="mt-2 text-[10px] leading-relaxed text-foreground/40">Masuk untuk mengelola KODEKABI: Jejak Algoritma</p>
        </div>

        <AdminLoginForm />

        <p className="mt-7 text-center font-mono text-[8px] uppercase tracking-[0.16em] text-foreground/25">Akses terbatas untuk administrator</p>
      </section>
    </main>
  );
}
