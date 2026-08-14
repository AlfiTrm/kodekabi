"use client";

import { useState } from "react";

import { AdminDatePicker } from "./admin-date-picker";
import { formatAdminDisplayDate } from "../utils/admin-date";

type AdminDateInputProps = {
  name?: string;
  label: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  includeTime?: boolean;
  containerClassName?: string;
};

export function AdminDateInput({ name, label, defaultValue = "", value: controlledValue, onValueChange, disabled = false, required = false, min, max, includeTime = false, containerClassName = "" }: AdminDateInputProps) {
  const [open, setOpen] = useState(false);
  const [internalDate, setInternalDate] = useState(defaultValue.slice(0, 10));
  const [internalTime, setInternalTime] = useState(defaultValue.includes("T") ? defaultValue.slice(11, 19) : "00:00:00");
  const date = controlledValue !== undefined ? controlledValue.slice(0, 10) : internalDate;
  const time = controlledValue?.includes("T") ? controlledValue.slice(11, 19) : internalTime;
  const value = date ? `${date}${includeTime ? `T${time}` : ""}` : "";

  function updateDate(nextDate: string) {
    setInternalDate(nextDate);
    onValueChange?.(`${nextDate}${includeTime ? `T${time}` : ""}`);
  }

  function updateTime(nextTime: string) {
    setInternalTime(nextTime);
    if (date) onValueChange?.(`${date}T${nextTime}`);
  }

  return (
    <div className={`block text-xs font-semibold ${containerClassName}`}>
      <span>{label}</span>
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}
      <button type="button" disabled={disabled} onClick={() => setOpen(true)} className="mt-2 flex h-11 w-full items-center justify-between rounded-xl border border-border-strong bg-background px-3 text-left text-xs font-normal outline-none transition-colors hover:border-purple disabled:cursor-not-allowed disabled:opacity-55">
        <span className={date ? "text-foreground" : "text-foreground/30"}>{date ? `${formatAdminDisplayDate(date)}${includeTime ? ` · ${time}` : ""}` : "Pilih tanggal"}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current text-foreground/45" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v3m10-3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 13h3m2 0h3m-8 4h3" /></svg>
      </button>
      {open ? <AdminDatePicker open mode="single" value={{ from: date, to: date }} includeTime={includeTime} time={time} onTimeChange={updateTime} min={min} max={max} onApply={(next) => updateDate(next.from)} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}
