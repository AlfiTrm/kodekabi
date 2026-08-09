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
    <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-border px-6 py-5 sm:px-10">
      <Image src="/logo/logo-icon.svg" alt="KODEKABI" width={40} height={40} className="size-8 sm:size-9" />
      <div className="flex items-center gap-3">
        <AuthProgress currentStep={currentStep} />
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:inline">{label}</span>
      </div>
      {backHref ? <Link href={backHref} className="justify-self-end text-[10px] text-foreground/55 transition-colors hover:text-foreground">Kembali</Link> : <span />}
    </header>
  );
}
