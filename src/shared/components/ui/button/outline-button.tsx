import Link from "next/link";

import type { VariantButtonProps } from "./types";

export function OutlineButton({ href, children, sizeClasses, className }: VariantButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center border border-border-strong bg-surface-elevated font-semibold text-foreground transition-colors duration-200 ${sizeClasses.face} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
