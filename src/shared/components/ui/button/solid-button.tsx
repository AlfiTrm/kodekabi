import Link from "next/link";

import type { VariantButtonProps } from "./types";

export function SolidButton({ href, children, sizeClasses, className }: VariantButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center bg-white font-semibold text-button-ink transition-colors duration-200 ${sizeClasses.face} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
