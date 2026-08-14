"use client";

import { useRef, useState } from "react";
import type { AdminRedeemType } from "../types/admin-redeem-item";

type RedeemTypeComboboxProps = {
  types: AdminRedeemType[];
  value: string;
  onInput: (value: string) => void;
  onSelect: (type: AdminRedeemType) => void;
};

export function RedeemTypeCombobox({ types, value, onInput, onSelect }: RedeemTypeComboboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const query = value.trim().toLocaleLowerCase("id-ID");
  const filteredTypes = types.filter((type) =>
    !query || type.name.toLocaleLowerCase("id-ID").includes(query) || type.code.toLocaleLowerCase("id-ID").includes(query),
  );

  return (
    <div ref={rootRef} className="relative">
      <div className={`flex h-12 overflow-hidden rounded-xl border bg-background transition-colors ${open ? "border-purple" : "border-border-strong focus-within:border-purple"}`}>
        <input
          value={value}
          onChange={(event) => {
            onInput(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          className="min-w-0 flex-1 bg-transparent px-4 text-xs outline-none placeholder:text-foreground/25"
          placeholder="Pilih atau tulis tipe baru"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="redeem-type-options"
        />
        <button type="button" onClick={() => setOpen((current) => !current)} className="grid w-11 cursor-pointer place-items-center border-l border-border-strong text-foreground/45" aria-label="Buka pilihan tipe">
          <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-3.5 fill-none stroke-current transition-transform ${open ? "rotate-180" : ""}`}>
            <path d="m4 6 4 4 4-4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div id="redeem-type-options" role="listbox" className={`absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 max-h-56 overflow-y-auto rounded-xl border border-border-strong bg-surface-elevated p-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition-[opacity,transform,visibility] duration-150 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
        {filteredTypes.map((type) => (
          <button key={type.redeem_type_id} type="button" role="option" aria-selected={value === type.name} onMouseDown={(event) => event.preventDefault()} onClick={() => { onSelect(type); setOpen(false); }} className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-foreground/70 hover:bg-white/5 hover:text-foreground">
            <span className="font-semibold">{type.name}</span>
            <span className="font-mono text-[10px] text-foreground/35">{type.code}</span>
          </button>
        ))}
        {filteredTypes.length === 0 ? (
          <p className="px-3 py-3 text-xs text-foreground/45">Tipe baru akan dibuat saat item disimpan.</p>
        ) : null}
      </div>
    </div>
  );
}
