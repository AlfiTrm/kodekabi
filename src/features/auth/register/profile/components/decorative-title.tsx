import Image from "next/image";

import type { TitleCosmetic } from "../types/cosmetic";

type DecorativeTitleProps = {
  title: TitleCosmetic;
  compact?: boolean;
};

export function DecorativeTitle({ title, compact = false }: DecorativeTitleProps) {
  const textSize = compact ? "text-[9px]" : "text-xs sm:text-sm";
  const spacing = compact ? "h-8 px-3" : "h-11 px-5";

  switch (title.style) {
    case "recruit":
      return (
        <span className={`relative inline-flex min-w-28 -skew-x-3 items-center justify-center bg-white font-display font-bold uppercase text-button-ink shadow-[3px_3px_0_var(--border-strong)] ${textSize} ${spacing}`}>
          <span className="absolute left-2 size-2 rounded-full bg-red" />
          <span className="skew-x-3">{title.label}</span>
        </span>
      );

    case "evidence":
      return (
        <span className={`relative inline-flex min-w-32 -skew-x-6 items-center justify-center bg-orange font-display font-bold uppercase text-button-ink shadow-[3px_3px_0_var(--orange-shadow)] ${textSize} ${spacing}`}>
          <span className="absolute -left-2 size-4 rotate-45 bg-orange" />
          <span className="absolute -right-2 size-4 rotate-45 bg-orange" />
          <span className="absolute left-2 h-1.5 w-1.5 rounded-full bg-button-ink/35" />
          <span className="skew-x-6">{title.label}</span>
        </span>
      );

    case "skeptic":
      return (
        <span className={`relative inline-flex min-w-36 items-center justify-center border-y-2 border-purple bg-surface-elevated font-display font-bold uppercase text-foreground shadow-[0_3px_0_var(--purple-shadow)] ${textSize} ${spacing}`}>
          <span className="absolute -top-2 left-1/2 flex size-4 -translate-x-1/2 items-center justify-center rounded-full bg-purple font-mono text-[8px] text-white">?</span>
          {title.label}
        </span>
      );

    case "guardian":
      return (
        <span className={`relative inline-flex min-w-36 items-center justify-center border-2 border-orange bg-green font-display font-bold uppercase tracking-[-0.02em] text-button-ink shadow-[0_4px_0_var(--green-shadow)] ${textSize} ${spacing}`}>
          <span className="absolute -left-3 size-5 rotate-45 border-b-2 border-l-2 border-orange bg-green" />
          <span className="absolute -right-3 size-5 rotate-45 border-r-2 border-t-2 border-orange bg-green" />
          <span className="absolute -top-3 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-orange bg-background">
            <Image src="/logo/logo-icon.svg" alt="" width={18} height={18} className="size-[18px]" />
          </span>
          {title.label}
        </span>
      );
  }
}
