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
    <>
      <header className="grid grid-cols-[auto_1fr] items-center gap-x-5 border-b border-border px-6 py-5 sm:px-10">
        <Link href="/" aria-label="KODEKABI Beranda" className="w-fit">
          <Image src="/logo/logo-icon.svg" alt="KODEKABI" width={40} height={40} className="size-8 sm:size-9" priority />
        </Link>

        <div className="flex min-w-0 items-center justify-self-end gap-3">
          <AuthProgress currentStep={currentStep} />
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:inline">{label}</span>
        </div>
      </header>

      {backHref ? (
        <div className="px-6 pt-6 sm:px-10">
          <Link
            href={backHref}
            className="inline-flex h-11 w-fit items-center rounded-full border border-border-strong px-6 text-xs font-semibold text-foreground/85 transition-colors hover:border-foreground/35 hover:bg-surface"
          >
            Kembali
          </Link>
        </div>
      ) : null}
    </>
  );
}
