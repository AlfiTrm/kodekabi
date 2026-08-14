"use client";

import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

import type { AdminQuestionEvidenceOption } from "../../types/admin-case";
import { evidenceInputClass, evidenceTextareaClass, EvidenceToggle } from "../evidence-form/evidence-form-controls";

export function QuestionSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
      {title ? <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-purple sm:text-xl">{title}</h2> : null}
      <div className={title ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

export function QuestionField({ label, containerClassName = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; containerClassName?: string }) {
  return <label className={`block text-xs font-semibold ${containerClassName}`}>{label}<input {...props} className={`mt-2 ${evidenceInputClass}`} /></label>;
}

export function QuestionTextarea({ label, containerClassName = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; containerClassName?: string }) {
  return <label className={`block text-xs font-semibold ${containerClassName}`}>{label}<textarea {...props} className={`mt-2 ${evidenceTextareaClass}`} /></label>;
}

export function RelatedEvidenceField({ evidences, selected, onToggle, disabled }: { evidences: AdminQuestionEvidenceOption[]; selected: string[]; onToggle: (id: string) => void; disabled: boolean }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold">Related Evidence</span>
      <input type="hidden" name="related_evidence_ids" value={JSON.stringify(selected)} />
      <div className="flex min-h-12 flex-wrap gap-2 rounded-xl border border-border-strong bg-background p-2">
        {evidences.map((evidence) => {
          const active = selected.includes(evidence.case_evidence_id);
          return (
            <button key={evidence.case_evidence_id} type="button" disabled={disabled} onClick={() => onToggle(evidence.case_evidence_id)} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-purple bg-purple/10 text-foreground" : "border-border text-foreground/50 hover:border-foreground/25 hover:text-foreground"}`}>
              <span className="font-mono text-purple">{evidence.code}</span><span className="max-w-52 truncate">{evidence.label}</span><span aria-hidden="true">{active ? "✓" : "+"}</span>
            </button>
          );
        })}
        {evidences.length === 0 ? <p className="px-2 py-1 text-xs text-foreground/40">Belum ada evidence yang dapat direferensikan.</p> : null}
      </div>
    </div>
  );
}

export function EditableTags({ label, tags, onAdd, onRemove, disabled }: { label: string; tags: string[]; onAdd: (value: string) => void; onRemove: (value: string) => void; disabled: boolean }) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold">{label}</span>
      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-border-strong bg-background p-2">
        {tags.map((tag) => <span key={tag} className="inline-flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-1.5 font-mono text-[10px] text-purple">{tag}<button type="button" disabled={disabled} onClick={() => onRemove(tag)} aria-label={`Hapus ${tag}`} className="cursor-pointer text-foreground/35 hover:text-red disabled:cursor-not-allowed">x</button></span>)}
        <input value={draft} disabled={disabled} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); onAdd(draft); setDraft(""); } }} placeholder="+ Tambah" className="h-7 min-w-28 flex-1 bg-transparent px-2 text-xs outline-none placeholder:text-foreground/30" />
        <button type="button" disabled={disabled || !draft.trim()} onClick={() => { onAdd(draft); setDraft(""); }} className="cursor-pointer rounded-lg border border-purple/35 px-3 py-1.5 text-[10px] text-purple disabled:cursor-not-allowed disabled:opacity-35">Tambah</button>
      </div>
    </div>
  );
}

export { EvidenceToggle as QuestionToggle };
