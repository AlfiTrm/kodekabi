import Image from "next/image";
import Link from "next/link";

import { AuthProgress } from "./auth-progress";

type AuthHeaderProps = {
  currentStep: number;
  label?: string;
  backHref?: string;
};

export function AuthHeader({ currentStep, label = "Setup Profil", backHref }: AuthHeaderProps) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 border-b border-border px-6 py-5 sm:px-10">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex h-9 w-fit items-center rounded-full border border-border-strong px-5 text-[10px] font-semibold text-foreground/85 transition-colors hover:border-foreground/35 hover:bg-surface"
        >
          Kembali
        </Link>
      ) : (
        <span />
      )}

      <div className="flex min-w-0 items-center justify-self-center gap-3">
        <AuthProgress currentStep={currentStep} />
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:inline">{label}</span>
      </div>

      <Link href="/" aria-label="KODEKABI Beranda" className="w-fit justify-self-end">
        <Image src="/logo/logo-icon.svg" alt="KODEKABI" width={40} height={40} className="size-8 sm:size-9" priority />
      </Link>
    </header>
  );
}
