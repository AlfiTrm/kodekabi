"use client";

import { FilterSelect } from "@/src/shared/components/ui/filter-select";

import { useRedeemFilters } from "../hooks/use-redeem-filters";
import type { RedeemFilter } from "../types/redeem";

const options = [
  { value: "all", label: "Semua reward" },
  { value: "owned", label: "Sudah dibeli" },
];

export function RedeemFilters({ search: initialSearch, filter }: { search: string; filter: RedeemFilter }) {
  const controls = useRedeemFilters(initialSearch, filter);

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative block min-w-0 flex-1 sm:max-w-md">
        <span className="sr-only">Cari reward</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 fill-none stroke-current text-foreground/40">
          <circle cx="11" cy="11" r="6.5" strokeWidth="1.8" /><path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input value={controls.search} onChange={(event) => controls.setSearch(event.target.value)} type="search" placeholder="Cari voucher atau partner..." aria-busy={controls.pending} className="h-11 w-full rounded-xl border border-border-strong bg-surface pl-11 pr-10 text-xs outline-none transition-colors placeholder:text-foreground/35 focus:border-purple" />
        {controls.pending ? <span aria-hidden="true" className="absolute right-4 top-1/2 size-3 -translate-y-1/2 animate-spin rounded-full border-2 border-purple/25 border-t-purple motion-reduce:animate-none" /> : null}
      </label>
      <FilterSelect label="Status" value={filter} options={options} onChange={(value) => controls.setFilter(value as RedeemFilter)} className="sm:w-52" />
    </div>
  );
}
