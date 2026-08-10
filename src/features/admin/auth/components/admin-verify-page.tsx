import Image from "next/image";

import { AdminVerifyForm } from "./admin-verify-form";

type AdminVerifyPageProps = {
  email: string;
  initialSeconds: number;
  expiresAt?: number;
};

export function AdminVerifyPage({ email, initialSeconds, expiresAt }: AdminVerifyPageProps) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-5 py-12 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_44%,rgba(242,109,109,0.11),transparent_30%),radial-gradient(circle_at_78%_60%,rgba(91,156,246,0.11),transparent_35%)]" />

      <section className="relative z-10 w-full max-w-[430px] rounded-3xl border border-border bg-surface px-7 py-8 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:px-9 sm:py-10">
        <div className="text-center">
          <Image src="/logo/logo-icon.svg" alt="KODEKABI" width={36} height={36} priority className="mx-auto size-9" />
          <h1 className="mt-5 font-display text-2xl font-semibold uppercase tracking-[-0.025em] sm:text-3xl">Verifikasi OTP<span className="text-red">.</span></h1>
          <p className="mt-2 text-[10px] text-foreground/40">Masukkan kode 6 digit untuk melanjutkan akses admin.</p>
        </div>

        <AdminVerifyForm email={email} initialSeconds={initialSeconds} expiresAt={expiresAt} />
      </section>
    </main>
  );
}
