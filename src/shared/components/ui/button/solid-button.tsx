import Link from "next/link";

import type { VariantButtonProps } from "./types";

export function SolidButton({ href, children, sizeClasses, className, disabled = false }: VariantButtonProps) {
  const classes = `inline-flex items-center justify-center bg-white font-semibold text-button-ink transition-colors duration-300 ${disabled ? "cursor-not-allowed !bg-surface-muted !text-foreground/55" : "cursor-pointer hover:bg-orange"} ${sizeClasses.face} ${className}`.trim();

  if (disabled) {
    return <span aria-disabled="true" className={classes}>{children}</span>;
  }

  return <Link href={href} className={classes}>{children}</Link>;
}
