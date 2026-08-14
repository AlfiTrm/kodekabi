"use client";

import { useEffect, useRef, useState } from "react";

export type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function FilterSelect({ label, value, options, onChange, disabled = false, className = "" }: FilterSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function close(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 w-full min-w-44 cursor-pointer items-center justify-between gap-4 rounded-xl border bg-surface px-4 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${open ? "border-purple" : "border-border-strong hover:border-foreground/30"}`}
      >
        <span className="min-w-0 truncate"><span className="text-foreground/45">{label}: </span><strong>{selected?.label ?? "Semua"}</strong></span>
        <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-3.5 shrink-0 fill-none stroke-current text-foreground/45 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="m4 6 4 4 4-4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div role="listbox" aria-label={label} className={`absolute inset-x-0 top-[calc(100%+0.4rem)] z-40 overflow-hidden rounded-xl border border-border-strong bg-surface-elevated p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-[opacity,transform,visibility] duration-150 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={option.value === value}
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false);
              if (option.value !== value) onChange(option.value);
            }}
            className={`w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${option.value === value ? "bg-purple/15 font-semibold text-purple" : "text-foreground/65 hover:bg-white/5 hover:text-foreground"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
