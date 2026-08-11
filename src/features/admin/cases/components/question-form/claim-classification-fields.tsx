import { AdminFilterSelect } from "../../../_shared/components/admin-filter-select";
import type { AdminQuestionDetail } from "../../types/admin-case";
import { EditableTags, QuestionTextarea } from "./question-form-controls";

export function ClaimClassificationFields({ tags, correctAnswer, onCorrectAnswer, onAdd, onRemove, disabled, initial }: { tags: string[]; correctAnswer: string; onCorrectAnswer: (value: string) => void; onAdd: (value: string) => void; onRemove: (value: string) => void; disabled: boolean; initial?: AdminQuestionDetail }) {
  return (
    <div className="space-y-5">
      <input type="hidden" name="taxonomy_tags" value={JSON.stringify(tags)} />
      <h3 className="font-display text-base font-semibold text-purple">Taxonomy Klasifikasi</h3>
      <EditableTags label="Taxonomy Tags" tags={tags} onAdd={onAdd} onRemove={onRemove} disabled={disabled} />
      <div><span className="mb-2 block text-xs font-semibold">Correct Answer</span><AdminFilterSelect name="correct_answer" label="Correct Answer" value={correctAnswer} options={tags.map((tag) => ({ value: tag, label: tag }))} onChange={onCorrectAnswer} disabled={disabled || tags.length === 0} showLabel={false} /></div>
      <QuestionTextarea name="explanation" label="Penjelasan (Optional)" placeholder="Jelaskan dasar klasifikasi klaim..." defaultValue={initial?.explanation} disabled={disabled} />
    </div>
  );
}
