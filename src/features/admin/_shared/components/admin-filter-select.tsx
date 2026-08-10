"use client";

import { useEffect, useRef, useState } from "react";

export type AdminFilterOption = {
  value: string;
  label: string;
};

type AdminFilterSelectProps = {
  name: string;
  label: string;
  value: string;
  options: AdminFilterOption[];
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export function AdminFilterSelect({ name, label, value, options, onChange, disabled = false }: AdminFilterSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function closeFromOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, []);

  function selectOption(option: AdminFilterOption) {
    setOpen(false);
    if (option.value !== value) onChange?.(option.value);
  }

  return (
    <div ref={rootRef} className="relative min-w-40">
      <input type="hidden" name={name} value={value} readOnly />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border bg-surface px-4 text-left text-xs outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55 ${open ? "border-purple" : "border-border-strong hover:border-foreground/25"}`}
      >
        <span className="text-foreground/45">{label}:</span>
        <strong className="min-w-0 flex-1 truncate font-semibold text-foreground">{selectedOption?.label ?? "Semua"}</strong>
        <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-3.5 shrink-0 fill-none stroke-current text-foreground/45 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="m4 6 4 4 4-4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        role="listbox"
        aria-label={`Filter ${label}`}
        className={`absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 overflow-hidden rounded-xl border border-border-strong bg-surface-elevated p-1.5 shadow-[0_8px_8px_rgba(0,0,0,0.32)] transition-[opacity,transform,visibility] duration-150 ease-out ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={open ? 0 : -1}
              onClick={() => selectOption(option)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors duration-150 ${selected ? "bg-purple/15 font-semibold text-purple" : "text-foreground/65 hover:bg-white/5 hover:text-foreground"}`}
            >
              {option.label}
              {selected ? <span aria-hidden="true">✓</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
