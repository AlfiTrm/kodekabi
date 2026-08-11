import { EditableTags, QuestionField, QuestionTextarea } from "./question-form-controls";
import type { AdminQuestionDetail } from "../../types/admin-case";

export function OpenEndedFields({ keywords, onAdd, onRemove, disabled, initial }: { keywords: string[]; onAdd: (value: string) => void; onRemove: (value: string) => void; disabled: boolean; initial?: AdminQuestionDetail }) {
  return (
    <div className="space-y-5">
      <input type="hidden" name="minimum_keywords" value={JSON.stringify(keywords)} />
      <h3 className="font-display text-base font-semibold text-purple">Kriteria Evaluasi Semantik</h3>
      <QuestionTextarea name="expected_key_points" label="Expected Key Points" placeholder="Poin penting yang wajib disebutkan pemain..." defaultValue={initial?.expected_key_points} required disabled={disabled} />
      <EditableTags label="Minimum Keywords" tags={keywords} onAdd={onAdd} onRemove={onRemove} disabled={disabled} />
      <QuestionTextarea name="evaluation_rubric" label="Evaluation Rubric" placeholder="Jelaskan pembagian skor evaluasi..." defaultValue={initial?.evaluation_rubric} required disabled={disabled} />
      <QuestionField name="max_score" type="number" min="1" defaultValue={initial?.max_score ?? 3} label="Max Score" containerClassName="max-w-52" required disabled={disabled} />
    </div>
  );
}
