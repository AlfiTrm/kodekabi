"use client";

import { useEffect, useState } from "react";

import { addAdminDays, addAdminMonths, endOfAdminMonth, formatAdminDateValue, parseAdminDate, startOfAdminMonth, todayAdminDate } from "../utils/admin-date";

export type AdminDatePreset = "today" | "7days" | "30days" | "month" | "custom";
export type AdminDateRange = { from: string; to: string; preset?: AdminDatePreset };

type AdminDatePickerProps = {
  open: boolean;
  mode?: "single" | "range";
  value: AdminDateRange;
  onApply: (value: AdminDateRange) => void;
  onClose: () => void;
  includeTime?: boolean;
  time?: string;
  onTimeChange?: (time: string) => void;
  min?: string;
  max?: string;
};

const dayLabels = ["Mi", "Se", "Se", "Ra", "Ka", "Ju", "Sa"];
const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });

function clampDate(value: string, min?: string, max?: string) {
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
}

function monthDays(month: Date) {
  const start = startOfAdminMonth(month);
  const gridStart = addAdminDays(start, -start.getDay());
  return Array.from({ length: 42 }, (_, index) => addAdminDays(gridStart, index));
}

function CalendarMonth({ month, draft, mode, min, max, onSelect, onPrevious, onNext }: {
  month: Date;
  draft: AdminDateRange;
  mode: "single" | "range";
  min?: string;
  max?: string;
  onSelect: (value: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  return (
    <section className="min-w-0 flex-1">
      <header className="flex h-10 items-center justify-between">
        {onPrevious ? <button type="button" onClick={onPrevious} aria-label="Bulan sebelumnya" className="grid size-9 place-items-center rounded-lg bg-background text-lg text-foreground/55 transition-colors hover:text-purple">‹</button> : <span className="size-9" />}
        <strong className="text-sm font-semibold capitalize">{monthFormatter.format(month)}</strong>
        {onNext ? <button type="button" onClick={onNext} aria-label="Bulan berikutnya" className="grid size-9 place-items-center rounded-lg bg-background text-lg text-foreground/55 transition-colors hover:text-purple">›</button> : <span className="size-9" />}
      </header>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-foreground/35">
        {dayLabels.map((label, index) => <span key={`${label}-${index}`} className="py-1">{label}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {monthDays(month).map((date) => {
          const dateValue = formatAdminDateValue(date);
          const outside = date.getMonth() !== month.getMonth();
          const disabled = Boolean((min && dateValue < min) || (max && dateValue > max));
          const endpoint = dateValue === draft.from || (mode === "range" && dateValue === draft.to);
          const inside = mode === "range" && Boolean(draft.from && draft.to && dateValue > draft.from && dateValue < draft.to);
          return (
            <button
              key={dateValue}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateValue)}
              aria-pressed={endpoint}
              className={`grid aspect-square min-h-8 place-items-center rounded-md text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-20 ${endpoint ? "bg-purple font-bold text-white" : inside ? "bg-purple/15 text-purple" : outside ? "text-foreground/20 hover:bg-white/5" : "text-foreground/80 hover:bg-white/7"}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function AdminDatePicker({ open, mode = "range", value, onApply, onClose, includeTime = false, time = "00:00", onTimeChange, min, max }: AdminDatePickerProps) {
  const initialDate = parseAdminDate(value.from) ?? new Date();
  const [viewMonth, setViewMonth] = useState(startOfAdminMonth(initialDate));
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!open) return undefined;
    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeFromKeyboard);
    return () => document.removeEventListener("keydown", closeFromKeyboard);
  }, [onClose, open]);

  if (!open) return null;

  function chooseDate(next: string) {
    if (mode === "single") {
      setDraft({ from: next, to: next, preset: "custom" });
      return;
    }
    if (!draft.from || (draft.from && draft.to) || next < draft.from) {
      setDraft({ from: next, to: "", preset: "custom" });
      return;
    }
    setDraft({ from: draft.from, to: next, preset: "custom" });
  }

  function setPreset(kind: "today" | "7days" | "30days" | "month") {
    const today = new Date();
    const to = formatAdminDateValue(today);
    const from = kind === "today"
      ? to
      : kind === "7days"
        ? formatAdminDateValue(addAdminDays(today, -6))
        : kind === "30days"
          ? formatAdminDateValue(addAdminDays(today, -29))
          : formatAdminDateValue(startOfAdminMonth(today));
    const next = { from: clampDate(from, min, max), to: clampDate(kind === "month" ? formatAdminDateValue(endOfAdminMonth(today)) : to, min, max), preset: kind };
    setDraft(next);
    setViewMonth(startOfAdminMonth(parseAdminDate(next.from) ?? today));
  }

  const complete = Boolean(draft.from && (mode === "single" || draft.to));

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={mode === "range" ? "Pilih rentang tanggal" : "Pilih tanggal"} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.58)]">
        {mode === "range" ? (
          <div className="flex flex-wrap gap-2 border-b border-border px-5 py-5 sm:px-7">
            {[["today", "Hari Ini"], ["7days", "7 Hari Terakhir"], ["30days", "30 Hari Terakhir"], ["month", "Bulan Ini"]].map(([kind, label]) => (
              <button key={kind} type="button" onClick={() => setPreset(kind as "today" | "7days" | "30days" | "month")} className={`rounded-lg border px-4 py-2 text-xs transition-colors ${draft.preset === kind ? "border-purple bg-purple/10 font-semibold text-purple" : "border-border-strong text-foreground/55 hover:border-purple hover:text-purple"}`}>{label}</button>
            ))}
            <span className={`rounded-lg border px-4 py-2 text-xs font-semibold ${draft.preset === "custom" ? "border-purple bg-purple/10 text-purple" : "border-border-strong text-foreground/35"}`}>Custom</span>
          </div>
        ) : null}

        <div className={`grid gap-6 px-5 py-5 sm:px-7 sm:py-7 ${mode === "range" ? "md:grid-cols-2 md:divide-x md:divide-border" : "mx-auto max-w-sm"}`}>
          <CalendarMonth month={viewMonth} draft={draft} mode={mode} min={min} max={max} onSelect={chooseDate} onPrevious={() => setViewMonth(addAdminMonths(viewMonth, -1))} onNext={mode === "single" ? () => setViewMonth(addAdminMonths(viewMonth, 1)) : undefined} />
          {mode === "range" ? <div className="md:pl-6"><CalendarMonth month={addAdminMonths(viewMonth, 1)} draft={draft} mode={mode} min={min} max={max} onSelect={chooseDate} onNext={() => setViewMonth(addAdminMonths(viewMonth, 1))} /></div> : null}
        </div>

        <footer className="flex flex-col gap-5 border-t border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div className="flex flex-wrap items-end gap-3">
            <div><span className="mb-2 block text-[10px] font-semibold uppercase text-foreground/35">{mode === "range" ? "Dari" : "Tanggal"}</span><output className="block rounded-lg border border-purple bg-background px-3 py-2 font-mono text-xs">{draft.from || "---- -- --"}</output></div>
            {mode === "range" ? <><span className="pb-2 text-foreground/30">-</span><div><span className="mb-2 block text-[10px] font-semibold uppercase text-foreground/35">Sampai</span><output className="block rounded-lg border border-border-strong bg-background px-3 py-2 font-mono text-xs">{draft.to || "---- -- --"}</output></div></> : null}
            {mode === "single" ? (
              <div className={includeTime ? "" : "opacity-35"}>
                <label htmlFor="admin-picker-time" className="mb-2 block text-[10px] font-semibold uppercase text-foreground/35">Waktu</label>
                <input
                  id="admin-picker-time"
                  type={includeTime ? "time" : "text"}
                  step={includeTime ? 1 : undefined}
                  value={includeTime ? time : "--:--"}
                  disabled={!includeTime}
                  onChange={(event) => onTimeChange?.(event.target.value)}
                  className="h-9 rounded-lg border border-border-strong bg-background px-3 font-mono text-xs outline-none focus:border-purple disabled:cursor-not-allowed [color-scheme:dark]"
                />
              </div>
            ) : null}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="h-10 rounded-xl border border-border-strong px-5 text-xs font-semibold text-foreground/55 transition-colors hover:text-foreground">Batal</button>
            <button type="button" disabled={!complete} onClick={() => { onApply({ from: draft.from, to: mode === "single" ? draft.from : draft.to, preset: draft.preset }); onClose(); }} className="h-10 rounded-xl bg-purple px-6 text-xs font-bold text-white transition-colors hover:bg-purple/85 disabled:bg-surface-muted disabled:text-foreground/30">Terapkan</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function defaultAdminDateRange(): AdminDateRange {
  const today = todayAdminDate();
  return { from: today, to: today };
}
