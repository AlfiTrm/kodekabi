"use client";

import { AdminDatePicker, type AdminDatePreset } from "../../_shared/components/admin-date-picker";
import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { auditActionOptions, auditModuleOptions, auditRangeOptions } from "../data/audit-log-options";
import { useAuditLogFilters } from "../hooks/use-audit-log-filters";

type AuditLogFiltersProps = {
  values: { actor: string; action: string; module: string; range: string; from: string; to: string };
  adminOptions: { value: string; label: string }[];
};

const pickerPresets = new Set<AdminDatePreset>(["today", "7days", "30days", "month", "custom"]);

export function AuditLogFilters({ values, adminOptions }: AuditLogFiltersProps) {
  const { filters, setFilter, setCustomRange, pickerOpen, setPickerOpen, applyFilters, isPending } = useAuditLogFilters(values);
  const rangeLabel = filters.range === "custom" && filters.from && filters.to
    ? `${filters.from} - ${filters.to}`
    : auditRangeOptions.find((option) => option.value === filters.range)?.label ?? "Pilih Rentang";
  const preset = pickerPresets.has(filters.range as AdminDatePreset) ? filters.range as AdminDatePreset : "custom";

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.05fr_1fr_1fr_1.2fr_auto]" aria-busy={isPending}>
        <AdminFilterSelect label="Pilih Admin" value={filters.actor} options={adminOptions} onChange={(value) => setFilter("actor", value)} disabled={isPending} showLabel={false} />
        <AdminFilterSelect label="Aksi" value={filters.action} options={auditActionOptions} onChange={(value) => setFilter("action", value)} disabled={isPending} />
        <AdminFilterSelect label="Modul" value={filters.module} options={auditModuleOptions} onChange={(value) => setFilter("module", value)} disabled={isPending} />
        <button type="button" disabled={isPending} onClick={() => setPickerOpen(true)} className="flex h-11 min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 text-left text-xs outline-none transition-colors hover:border-foreground/25 disabled:cursor-not-allowed disabled:opacity-55" aria-haspopup="dialog">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 fill-none stroke-current text-foreground/45" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v3m10-3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="2" /></svg>
          <span className="text-foreground/45">Rentang Waktu:</span>
          <strong className="min-w-0 flex-1 truncate font-semibold text-foreground">{rangeLabel}</strong>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0 fill-none stroke-current text-foreground/45"><path d="m4 6 4 4 4-4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" onClick={applyFilters} disabled={isPending || (filters.range === "custom" && (!filters.from || !filters.to))} className="h-11 rounded-full bg-purple px-7 text-xs font-bold text-white transition-colors hover:bg-purple/85 disabled:bg-surface-muted disabled:text-foreground/30">{isPending ? "Memuat..." : "Terapkan Filter"}</button>
      </div>
      {pickerOpen ? <AdminDatePicker open mode="range" value={{ from: filters.from, to: filters.to, preset }} onApply={setCustomRange} onClose={() => setPickerOpen(false)} /> : null}
    </>
  );
}
