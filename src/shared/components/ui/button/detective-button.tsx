import Link from "next/link";

import animationStyles from "./animations.module.css";
import type { VariantButtonProps } from "./types";

export function DetectiveButton({ href, children, sizeClasses, className, tone = "light", hoverAsset, autoPlay = false }: VariantButtonProps) {
  const isOrange = tone === "orange";

  return (
    <Link
      href={href}
      data-autoplay={autoPlay ? "true" : undefined}
      className={`group relative inline-flex cursor-pointer items-center justify-center overflow-hidden font-semibold transition-colors duration-200 ${isOrange ? "bg-orange text-button-ink group-hover:bg-orange" : "bg-white text-button-ink group-hover:bg-background group-hover:text-foreground"} ${sizeClasses.face} ${className}`.trim()}
    >
      <span
        aria-hidden="true"
          className={`${animationStyles.evidenceSlip} absolute left-1/2 top-0 z-0 flex h-5 w-[44%] -translate-x-1/2 flex-col justify-between border border-border-strong bg-white px-1 py-0 text-[5px] font-bold uppercase tracking-[0.08em] text-button-ink shadow-[0_1px_0_var(--orange-shadow)]`}
        >
          <span className="flex items-center justify-between gap-1">
          <span>Evidence</span>
          <span className="text-orange">07</span>
        </span>
        <span className="mt-0.5 h-px w-full bg-border-strong/40" />
        <span className="mt-0 flex items-center justify-between text-[4px] tracking-[0.06em] text-button-ink/60">
          <span>Open File</span>
          <span className="border border-orange px-0.5 text-orange">Ready</span>
        </span>
      </span>

      <span
        aria-hidden="true"
        className={`${animationStyles.detectiveLens} pointer-events-none absolute -bottom-3 right-1 z-20 size-12`}
      >
        <span className="absolute inset-[5px] rounded-full bg-white/5 backdrop-blur-[0.5px]" />
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 size-full">
          <circle cx="32" cy="32" r="25" fill="rgba(255,255,255,0.08)" stroke="var(--lens-ring)" strokeWidth="3.5" />
          <circle cx="32" cy="32" r="19" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
          <path d="M18 24c5-7 12-10 20-9" stroke="white" strokeOpacity="0.42" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>

      {hoverAsset ? (
        <span
          aria-hidden="true"
          className={`${animationStyles.detectiveAsset} pointer-events-none absolute -bottom-12 left-0 z-0 size-18`}
        >
          {hoverAsset}
        </span>
      ) : null}

      <span className="relative z-10 inline-flex items-center justify-center">{children}</span>
    </Link>
  );
}
