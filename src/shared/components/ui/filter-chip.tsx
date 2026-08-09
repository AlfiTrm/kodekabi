import type { ButtonHTMLAttributes, ReactNode } from "react";

type FilterChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  selected?: boolean;
};

export function FilterChip({ children, selected = false, className = "", ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex h-9 items-center justify-center rounded-full border px-4 text-[10px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-95 ${
        selected
          ? "border-foreground bg-foreground text-button-ink"
          : "border-border-strong bg-transparent text-foreground/55 hover:border-foreground/35 hover:text-foreground"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

