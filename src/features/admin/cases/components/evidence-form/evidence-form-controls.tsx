"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

import { AdminDateInput } from "../../../_shared/components/admin-date-input";
import { credibilityTagOptions } from "../../data/evidence-form-options";
import { useCredibilityTags } from "../../hooks/use-credibility-tags";
import { useEvidenceImageUpload } from "../../hooks/use-evidence-image-upload";

export const evidenceInputClass = "h-11 w-full rounded-xl border border-border-strong bg-background px-3 text-xs text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple disabled:cursor-not-allowed disabled:opacity-55";
export const evidenceTextareaClass = "min-h-28 w-full resize-y rounded-xl border border-border-strong bg-background px-3 py-3 text-xs leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple disabled:cursor-not-allowed disabled:opacity-55";

type EvidenceFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; containerClassName?: string };

export function EvidenceField({ label, className = "", containerClassName = "", ...props }: EvidenceFieldProps) {
  return (
    <label className={`block text-xs font-semibold ${containerClassName}`}>
      {label}
      <input {...props} className={`mt-2 ${evidenceInputClass} ${className}`} />
    </label>
  );
}

type EvidenceDateTimeFieldProps = Pick<EvidenceFieldProps, "label" | "name" | "defaultValue" | "disabled" | "required" | "min" | "max" | "containerClassName"> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function EvidenceDateTimeField(props: EvidenceDateTimeFieldProps) {
  return <AdminDateInput {...props} defaultValue={String(props.defaultValue ?? "")} min={props.min ? String(props.min).slice(0, 10) : undefined} max={props.max ? String(props.max).slice(0, 10) : undefined} includeTime />;
}

export function EvidenceDateField(props: EvidenceDateTimeFieldProps) {
  return <AdminDateInput {...props} defaultValue={String(props.defaultValue ?? "")} min={props.min ? String(props.min) : undefined} max={props.max ? String(props.max) : undefined} />;
}

type EvidenceTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; containerClassName?: string };

export function EvidenceTextarea({ label, className = "", containerClassName = "", ...props }: EvidenceTextareaProps) {
  return (
    <label className={`block text-xs font-semibold ${containerClassName}`}>
      {label}
      <textarea {...props} className={`mt-2 ${evidenceTextareaClass} ${className}`} />
    </label>
  );
}

export function EvidenceFormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
      <h2 className="font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function EvidenceToggle({ name, label, checked, onChange, disabled = false }: { name: string; label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 text-xs font-semibold">
      {label}
      <input type="hidden" name={name} value={String(checked)} />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-green" : "bg-foreground/20"}`}
      >
        <span className={`absolute left-1 top-1 size-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </label>
  );
}

export function CredibilityTagsField({ selected, onChange, disabled = false }: { selected: string[]; onChange: (tags: string[]) => void; disabled?: boolean }) {
  const { open, toggleOpen, toggleTag } = useCredibilityTags(selected, onChange);

  return (
    <div className="relative">
      <span className="mb-2 block text-xs font-semibold">Credibility Tags</span>
      <input type="hidden" name="credibility_tags" value={selected.join(",")} />
      <button type="button" aria-haspopup="listbox" aria-expanded={open} disabled={disabled} onClick={toggleOpen} className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border bg-background px-3 text-left text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${open ? "border-purple" : "border-border-strong"}`}>
        <span className={selected.length ? "text-foreground" : "text-foreground/30"}>{selected.length ? selected.map((tag) => credibilityTagOptions.find((option) => option.value === tag)?.label ?? tag).join(", ") : "Pilih credibility tags"}</span>
        <span aria-hidden="true" className={`text-foreground/45 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open ? (
        <div role="listbox" aria-label="Credibility tags" aria-multiselectable="true" className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 rounded-xl border border-border-strong bg-surface-elevated p-1.5 shadow-[0_8px_8px_rgba(0,0,0,0.32)]">
          {credibilityTagOptions.map((option) => {
            const active = selected.includes(option.value);
            return <button key={option.value} type="button" role="option" aria-selected={active} onClick={() => toggleTag(option.value)} className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${active ? "bg-purple/15 font-semibold text-purple" : "text-foreground/65 hover:bg-white/5 hover:text-foreground"}`}><span>{option.label}</span><span aria-hidden="true">{active ? "✓" : ""}</span></button>;
          })}
        </div>
      ) : null}
    </div>
  );
}

export function EvidenceImageUpload({ disabled = false }: { disabled?: boolean }) {
  const { inputRef, fileName, error, handleChange, handleDrop } = useEvidenceImageUpload(disabled);

  return (
    <div>
      <label onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className={`grid min-h-36 place-items-center rounded-xl border border-dashed px-5 text-center transition-colors ${disabled ? "cursor-not-allowed border-border opacity-55" : "cursor-pointer border-border-strong bg-background hover:border-purple/60"}`}>
        <input ref={inputRef} type="file" name="image" accept="image/png,image/jpeg" disabled={disabled} onChange={handleChange} className="sr-only" />
        <span>
          <span aria-hidden="true" className="text-xl">▣</span>
          <strong className="ml-2 text-xs font-medium text-foreground/65">{fileName || "Klik atau seret file gambar untuk upload"}</strong>
          <span className="mt-1.5 block text-[10px] text-foreground/35">PNG atau JPG · maksimal 5MB</span>
        </span>
      </label>
      {error ? <p role="alert" className="mt-2 text-[10px] text-red">{error}</p> : null}
    </div>
  );
}
