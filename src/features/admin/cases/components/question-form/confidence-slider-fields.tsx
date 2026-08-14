import { QuestionField, QuestionToggle } from "./question-form-controls";
import type { AdminQuestionDetail } from "../../types/admin-case";

export function ConfidenceSliderFields({ warning, onWarningChange, disabled, initial }: { warning: boolean; onWarningChange: (value: boolean) => void; disabled: boolean; initial?: AdminQuestionDetail }) {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-base font-semibold text-purple">Konfigurasi Confidence</h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuestionField name="min_value" type="number" defaultValue={initial?.min_value ?? 0} label="Min Value" required disabled={disabled} />
        <QuestionField name="max_value" type="number" defaultValue={initial?.max_value ?? 100} label="Max Value" required disabled={disabled} />
        <QuestionField name="snap_interval" type="number" min="1" defaultValue={initial?.snap_interval ?? 5} label="Snap Interval" required disabled={disabled} />
        <QuestionField name="default_value" type="number" defaultValue={initial?.default_value ?? 50} label="Default Value" required disabled={disabled} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <QuestionField name="label_low" defaultValue={initial?.label_low ?? "Tidak Yakin"} label="Label Low (Minimum)" required disabled={disabled} />
        <QuestionField name="label_high" defaultValue={initial?.label_high ?? "Sangat Yakin"} label="Label High (Maximum)" required disabled={disabled} />
      </div>
      <div className="rounded-xl border border-border-strong bg-background p-4"><QuestionToggle name="show_warning_on_large_change" label="Tampilkan peringatan saat perubahan confidence terlalu besar" checked={warning} onChange={onWarningChange} disabled={disabled} /></div>
    </div>
  );
}
