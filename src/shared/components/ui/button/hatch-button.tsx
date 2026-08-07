import Link from "next/link";

import type { VariantButtonProps } from "./types";

export function HatchButton({
  href,
  children,
  sizeClasses,
  className,
  hoverLabel,
  isOutlineHatch = false,
}: VariantButtonProps & { isOutlineHatch?: boolean }) {

  return (
    <Link
      href={href}
      className={`group relative inline-flex perspective-distant items-start justify-center font-semibold ${sizeClasses.shell} ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className={`absolute ${sizeClasses.base} border border-border-strong bg-background opacity-0 transition-opacity duration-120 ease-out group-hover:opacity-100`}
      />

      <span
        aria-hidden="true"
        className={`button-cavity-beam ${isOutlineHatch ? "button-cavity-beam--white" : ""} pointer-events-none absolute inset-x-0 top-[35%] -bottom-7 z-1 opacity-0 transition-opacity duration-160 ease-out group-hover:animate-[button-cavity-flicker_5.8s_steps(1,end)_120ms_infinite]`}
      />

      <span
        aria-hidden="true"
        className={`button-cavity-source ${isOutlineHatch ? "button-cavity-source--white" : ""} pointer-events-none absolute inset-x-[19%] top-[35%] z-2 h-0.5 opacity-0 group-hover:animate-[button-cavity-flicker_5.8s_steps(1,end)_120ms_infinite]`}
      />

      <span className="relative z-10 inline-flex origin-top transform-3d transition-transform duration-100 ease-out group-hover:animate-[button-flap-lift_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <span
          aria-hidden="true"
          className={`absolute inset-x-[1.5px] top-0.5 -bottom-0.5 rounded-full border border-border ${isOutlineHatch ? "bg-surface-muted" : "bg-white/50"} opacity-0 transition-opacity duration-120 ease-out group-hover:opacity-100`}
        />

        <span
          className={`relative inline-flex origin-top transform-3d items-center justify-center overflow-hidden ${isOutlineHatch ? "border border-border-strong bg-surface-elevated text-foreground" : "bg-white text-button-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition-[background] duration-120 ease-out group-hover:bg-[linear-gradient(180deg,rgba(224,228,234,0.96)_0%,rgba(248,249,251,1)_54%,rgba(255,255,255,1)_100%)]"} ${sizeClasses.face}`}
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-120 ease-out group-hover:opacity-100">
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,24,0)_0%,rgba(255,255,255,0.04)_6%,rgba(255,255,255,0.14)_22%,rgba(255,255,255,0.35)_72%,rgba(255,255,255,0.2)_100%)]" />
            <span className="absolute inset-y-[-15%] left-[-24%] w-[22%] -skew-x-[18deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_20%,rgba(255,255,255,0.78)_50%,rgba(255,255,255,0.05)_80%,transparent_100%)] opacity-0 group-hover:animate-[button-plate-specular_320ms_cubic-bezier(0.16,1,0.3,1)_120ms_forwards]" />
          </span>

          <span className="relative z-10 inline-flex translate-z-0.5 items-center justify-center transition-transform duration-120 ease-out">
            {hoverLabel ? (
              <>
                <span className="transition-opacity duration-150 ease-out group-hover:opacity-0">{children}</span>
                <span className="absolute opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100">{hoverLabel}</span>
              </>
            ) : (
              children
            )}
          </span>
        </span>
      </span>
    </Link>
  );
}
