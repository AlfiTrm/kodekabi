import type { ChangeEvent } from "react";

import { AdminIcon } from "./admin-icon";

type AdminSearchFieldProps = {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  pending?: boolean;
};

export function AdminSearchField({ name = "search", defaultValue, value, onChange, placeholder = "Cari...", pending = false }: AdminSearchFieldProps) {
  return (
    <label className="relative block min-w-0 flex-1 sm:max-w-[380px]">
      <span className="sr-only">Pencarian</span>
      <AdminIcon name="search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
      <input type="search" name={name} defaultValue={defaultValue} value={value} onChange={onChange} placeholder={placeholder} aria-busy={pending} className="h-11 w-full rounded-xl border border-border-strong bg-surface pl-11 pr-10 text-xs text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-purple" />
      {pending ? <span aria-hidden="true" className="absolute right-4 top-1/2 size-3 -translate-y-1/2 animate-spin rounded-full border-2 border-purple/25 border-t-purple" /> : null}
    </label>
  );
}
