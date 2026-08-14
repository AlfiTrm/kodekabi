"use client";

import Link from "next/link";

import { questionTypeOptions } from "../../data/question-form-options";
import { useEditQuestionForm } from "../../hooks/use-edit-question-form";
import type { AdminCase, AdminQuestionDetail, AdminQuestionEvidenceOption } from "../../types/admin-case";
import { ClaimClassificationFields } from "./claim-classification-fields";
import { ConfidenceSliderFields } from "./confidence-slider-fields";
import { McqFields } from "./mcq-fields";
import { OpenEndedFields } from "./open-ended-fields";
import { QuestionField, QuestionSection, QuestionTextarea, RelatedEvidenceField } from "./question-form-controls";

type EditQuestionFormProps = {
  caseItem: AdminCase;
  question: AdminQuestionDetail;
  evidences: AdminQuestionEvidenceOption[];
};

export function EditQuestionForm({ caseItem, question, evidences }: EditQuestionFormProps) {
  const form = useEditQuestionForm(question);
  const typeLabel = questionTypeOptions.find((option) => option.value === question.question_type)?.label ?? question.question_type;
  const detailHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}/questions/${encodeURIComponent(question.case_question_id)}?caseId=${encodeURIComponent(caseItem.case_id)}&versionId=${encodeURIComponent(caseItem.current_case_version_id)}`;

  function renderTypeFields() {
    switch (question.question_type) {
      case "mcq":
        return <McqFields options={form.options} onChange={form.updateOption} onCorrect={form.selectCorrectOption} onAdd={form.addOption} onRemove={form.removeOption} disabled={form.pending} initialExplanation={question.explanation} />;
      case "open_ended":
        return <OpenEndedFields keywords={form.minimumKeywords} onAdd={(value) => form.addTag(value, "keyword")} onRemove={(value) => form.removeTag(value, "keyword")} disabled={form.pending} initial={question} />;
      case "confidence_slider":
        return <ConfidenceSliderFields warning={form.showWarning} onWarningChange={form.setShowWarning} disabled={form.pending} initial={question} />;
      case "claim_classification":
        return <ClaimClassificationFields tags={form.taxonomyTags} correctAnswer={form.correctAnswer} onCorrectAnswer={form.setCorrectAnswer} onAdd={(value) => form.addTag(value, "taxonomy")} onRemove={(value) => form.removeTag(value, "taxonomy")} disabled={form.pending} initial={question} />;
    }
  }

  return (
    <form onSubmit={form.handleSubmit} className="mt-7 space-y-5">
      <input type="hidden" name="case_id" value={caseItem.case_id} />
      <input type="hidden" name="version_id" value={caseItem.current_case_version_id} />
      <input type="hidden" name="question_id" value={question.case_question_id} />
      <input type="hidden" name="case_slug" value={caseItem.slug} />
      <input type="hidden" name="question_type" value={question.question_type} />
      <input type="hidden" name="sort_order" value={question.sort_order} />

      <QuestionSection>
        <span className="mb-2 block text-xs font-semibold">Tipe Question</span>
        <div className="flex h-11 items-center rounded-xl border border-border-strong bg-background px-3 text-xs font-semibold text-foreground/65">{typeLabel}</div>
      </QuestionSection>

      <QuestionSection title="Informasi Question">
        <div className="space-y-5">
          <QuestionTextarea name="question_text" label="Question Text" defaultValue={question.question_text} required disabled={form.pending} />
          <div className="grid gap-5 lg:grid-cols-[12rem_1fr]">
            <QuestionField name="scoring_weight" type="number" min="1" max="100" defaultValue={question.scoring_weight} label="Scoring Weight" required disabled={form.pending} />
            <RelatedEvidenceField evidences={evidences} selected={form.relatedEvidenceIds} onToggle={form.toggleEvidence} disabled={form.pending} />
          </div>
        </div>
      </QuestionSection>

      <QuestionSection>{renderTypeFields()}</QuestionSection>

      {form.state.error ? <p role="alert" className="rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{form.state.error}</p> : null}

      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Link href={detailHref} className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground">Batal</Link>
        <button type="submit" disabled={form.pending || form.relatedEvidenceIds.length === 0} className="h-10 min-w-40 cursor-pointer rounded-full bg-purple px-6 text-xs font-semibold text-white transition-colors hover:bg-purple/80 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">{form.pending ? "Memperbarui..." : "Update Question"}</button>
      </div>
    </form>
  );
}
