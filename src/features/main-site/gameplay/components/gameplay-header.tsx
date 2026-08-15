import Image from "next/image";
import Link from "next/link";

type GameplayHeaderProps = {
  caseTitle: string;
};

export function GameplayHeader({ caseTitle }: GameplayHeaderProps) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-blue/35 px-6 py-4 sm:px-10">
      <Link
        href="/cases"
        className="inline-flex h-9 w-fit items-center rounded-full border border-border-strong px-5 text-[10px] font-semibold text-foreground/80 transition-colors hover:border-foreground/40 hover:bg-surface"
      >
        Kembali
      </Link>
      <p className="truncate px-4 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:text-[10px]">
        Briefing Misi · {caseTitle}
      </p>
      <Link href="/lobby" aria-label="Kembali ke Kota Nusa" className="justify-self-end">
        <Image src="/logo/logo-icon.svg" alt="KODEKABI" width={40} height={40} className="size-8 sm:size-9" priority />
      </Link>
    </header>
  );
}
