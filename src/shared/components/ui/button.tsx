import { DetectiveButton } from "./button/detective-button";
import { HatchButton } from "./button/hatch-button";
import { OutlineButton } from "./button/outline-button";
import { SolidButton } from "./button/solid-button";
import type { ButtonProps, ButtonSize } from "./button/types";

const sizeClasses: Record<
  ButtonSize,
  {
    shell: string;
    face: string;
    base: string;
  }
> = {
  compact: {
    shell: "h-10",
    face: "h-10 rounded-full px-4 text-sm",
    base: "inset-x-[0.5px] top-0 bottom-0 rounded-full",
  },
  default: {
    shell: "h-[41px]",
    face: "h-[41px] rounded-full px-8 text-sm",
    base: "inset-x-[0.5px] top-0 bottom-0 rounded-full",
  },
};

export function Button({
  href,
  children,
  variant = "outline",
  size = "default",
  className = "",
  hoverLabel,
  tone = "light",
  hoverAsset,
  autoPlay = false,
  disabled = false,
}: ButtonProps) {
  const variantProps = {
    href,
    children,
    sizeClasses: sizeClasses[size],
    className,
    hoverLabel,
    tone,
    hoverAsset,
    autoPlay,
    disabled,
  };

  switch (variant) {
    case "outline":
      return <OutlineButton {...variantProps} />;
    case "solid":
      return <SolidButton {...variantProps} />;
    case "hatch":
      return <HatchButton {...variantProps} />;
    case "hatch-outline":
      return <HatchButton {...variantProps} isOutlineHatch />;
    case "detective":
      return <DetectiveButton {...variantProps} />;
  }
}

export type { ButtonProps } from "./button/types";
