import type { QuestionMcqOptionDraft } from "../../types/admin-case";
import { QuestionTextarea } from "./question-form-controls";

type McqFieldsProps = {
  options: QuestionMcqOptionDraft[];
  onChange: (index: number, text: string) => void;
  onCorrect: (index: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  disabled: boolean;
  initialExplanation?: string;
};

export function McqFields({ options, onChange, onCorrect, onAdd, onRemove, disabled, initialExplanation }: McqFieldsProps) {
  return (
    <div className="space-y-5">
      <input type="hidden" name="options" value={JSON.stringify(options)} />
      <div>
        <h3 className="font-display text-base font-semibold text-purple">Pilihan Jawaban</h3>
        <div className="mt-3 space-y-2">
          {options.map((option, index) => (
            <div key={option.option_code} className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors ${option.is_correct ? "border-green bg-green/8" : "border-border bg-surface-muted"}`}>
              <span className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-bold ${option.is_correct ? "bg-green text-background" : "bg-background text-foreground/60"}`}>{option.option_code}</span>
              <input value={option.option_text} disabled={disabled} onChange={(event) => onChange(index, event.target.value)} placeholder={`Pilihan ${option.option_code}`} className="h-9 min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-foreground/30 disabled:cursor-not-allowed" />
              <button type="button" disabled={disabled} onClick={() => onCorrect(index)} aria-label={`Jadikan pilihan ${option.option_code} jawaban benar`} className={`size-5 shrink-0 cursor-pointer rounded-full border-2 disabled:cursor-not-allowed ${option.is_correct ? "border-green bg-green shadow-[inset_0_0_0_4px_#121319]" : "border-foreground/35"}`} />
              {options.length > 2 ? <button type="button" disabled={disabled} onClick={() => onRemove(index)} aria-label={`Hapus pilihan ${option.option_code}`} className="cursor-pointer px-1 text-xs text-foreground/30 hover:text-red disabled:cursor-not-allowed">x</button> : null}
            </div>
          ))}
        </div>
        <button type="button" disabled={disabled || options.length >= 8} onClick={onAdd} className="mt-3 cursor-pointer rounded-xl border border-border-strong px-4 py-2 text-[10px] text-foreground/60 transition-colors hover:border-purple hover:text-purple disabled:cursor-not-allowed disabled:opacity-40">+ Tambah Opsi</button>
      </div>
      <QuestionTextarea name="explanation" label="Penjelasan (Explanation)" placeholder="Jelaskan alasan jawaban yang benar..." defaultValue={initialExplanation} required disabled={disabled} />
    </div>
  );
}
