import type { ReactNode } from "react";

export type ButtonSize = "compact" | "default";
export type ButtonVariant = "outline" | "solid" | "hatch" | "hatch-outline" | "detective";
export type DetectiveTone = "light" | "orange";

export type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  hoverLabel?: ReactNode;
  tone?: DetectiveTone;
  hoverAsset?: ReactNode;
};

export type VariantButtonProps = {
  href: string;
  children: ReactNode;
  sizeClasses: {
    shell: string;
    face: string;
    base: string;
  };
  className: string;
  hoverLabel?: ReactNode;
  tone?: DetectiveTone;
  hoverAsset?: ReactNode;
};
