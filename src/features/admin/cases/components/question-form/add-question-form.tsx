"use client";

import Link from "next/link";

import { AdminFilterSelect } from "../../../_shared/components/admin-filter-select";
import { questionTypeOptions } from "../../data/question-form-options";
import { useAddQuestionForm } from "../../hooks/use-add-question-form";
import type { AdminCase, AdminQuestionEvidenceOption, AdminQuestionType } from "../../types/admin-case";
import { ClaimClassificationFields } from "./claim-classification-fields";
import { ConfidenceSliderFields } from "./confidence-slider-fields";
import { McqFields } from "./mcq-fields";
import { OpenEndedFields } from "./open-ended-fields";
import { QuestionField, QuestionSection, QuestionTextarea, RelatedEvidenceField } from "./question-form-controls";

type AddQuestionFormProps = {
  caseItem: AdminCase;
  evidences: AdminQuestionEvidenceOption[];
  nextSortOrder: number;
};

export function AddQuestionForm({ caseItem, evidences, nextSortOrder }: AddQuestionFormProps) {
  const form = useAddQuestionForm();
  const detailHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}&tab=questions#workspace`;

  function renderTypeFields() {
    switch (form.questionType) {
      case "mcq":
        return <McqFields options={form.options} onChange={form.updateOption} onCorrect={form.selectCorrectOption} onAdd={form.addOption} onRemove={form.removeOption} disabled={form.pending} />;
      case "open_ended":
        return <OpenEndedFields keywords={form.minimumKeywords} onAdd={(value) => form.addTag(value, "keyword")} onRemove={(value) => form.removeTag(value, "keyword")} disabled={form.pending} />;
      case "confidence_slider":
        return <ConfidenceSliderFields warning={form.showWarning} onWarningChange={form.setShowWarning} disabled={form.pending} />;
      case "claim_classification":
        return <ClaimClassificationFields tags={form.taxonomyTags} correctAnswer={form.correctAnswer} onCorrectAnswer={form.setCorrectAnswer} onAdd={(value) => form.addTag(value, "taxonomy")} onRemove={(value) => form.removeTag(value, "taxonomy")} disabled={form.pending} />;
    }
  }

  return (
    <form onSubmit={form.handleSubmit} className="mt-7 space-y-5">
      <input type="hidden" name="case_id" value={caseItem.case_id} />
      <input type="hidden" name="version_id" value={caseItem.current_case_version_id} />
      <input type="hidden" name="case_slug" value={caseItem.slug} />
      <input type="hidden" name="sort_order" value={nextSortOrder} />

      <QuestionSection>
        <span className="mb-2 block text-xs font-semibold">Tipe Question</span>
        <AdminFilterSelect name="question_type" label="Tipe Question" value={form.questionType} options={questionTypeOptions} onChange={(value) => form.setQuestionType(value as AdminQuestionType)} disabled={form.pending} showLabel={false} />
      </QuestionSection>

      <QuestionSection title="Informasi Question">
        <div className="space-y-5">
          <QuestionTextarea name="question_text" label="Question Text" placeholder="Tulis pertanyaan investigasi..." required disabled={form.pending} />
          <div className="grid gap-5 lg:grid-cols-[12rem_1fr]">
            <QuestionField key={form.questionType} name="scoring_weight" type="number" min="1" max="100" defaultValue={form.questionType === "mcq" || form.questionType === "open_ended" ? "15" : "10"} label="Scoring Weight" required disabled={form.pending} />
            <RelatedEvidenceField evidences={evidences} selected={form.relatedEvidenceIds} onToggle={form.toggleEvidence} disabled={form.pending} />
          </div>
        </div>
      </QuestionSection>

      <QuestionSection>{renderTypeFields()}</QuestionSection>

      {form.state.error ? <p role="alert" className="rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{form.state.error}</p> : null}

      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Link href={detailHref} className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground">Batal</Link>
        <button type="submit" disabled={form.pending || evidences.length === 0 || form.relatedEvidenceIds.length === 0} className="h-10 min-w-40 cursor-pointer rounded-full bg-purple px-6 text-xs font-semibold text-white transition-colors hover:bg-purple/80 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">{form.pending ? "Menyimpan..." : "Simpan Question"}</button>
      </div>
    </form>
  );
}
