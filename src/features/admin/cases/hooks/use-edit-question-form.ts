"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";

import { updateAdminQuestionAction } from "../actions/update-admin-question-action";
import type { AdminQuestionDetail, QuestionMcqOptionDraft } from "../types/admin-case";

const initialState = { error: null };

export function useEditQuestionForm(question: AdminQuestionDetail) {
  const [state, formAction, pending] = useActionState(updateAdminQuestionAction, initialState);
  const [relatedEvidenceIds, setRelatedEvidenceIds] = useState<string[]>(
    () => (question.evidence_references ?? []).map((reference) => reference.case_evidence_id),
  );
  const [options, setOptions] = useState<QuestionMcqOptionDraft[]>(() => {
    const existing = question.options?.map(({ option_code, option_text, is_correct }) => ({ option_code, option_text, is_correct }));
    return existing?.length ? existing : [
      { option_code: "A", option_text: "", is_correct: true },
      { option_code: "B", option_text: "", is_correct: false },
    ];
  });
  const [minimumKeywords, setMinimumKeywords] = useState<string[]>(question.minimum_keywords ?? []);
  const [taxonomyTags, setTaxonomyTags] = useState<string[]>(question.taxonomy_tags ?? []);
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer ?? question.taxonomy_tags?.[0] ?? "");
  const [showWarning, setShowWarning] = useState(Boolean(question.show_warning_on_large_change));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  function toggleEvidence(evidenceId: string) {
    setRelatedEvidenceIds((current) => current.includes(evidenceId) ? current.filter((id) => id !== evidenceId) : [...current, evidenceId]);
  }

  function updateOption(index: number, optionText: string) {
    setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? { ...option, option_text: optionText } : option));
  }

  function selectCorrectOption(index: number) {
    setOptions((current) => current.map((option, optionIndex) => ({ ...option, is_correct: optionIndex === index })));
  }

  function addOption() {
    setOptions((current) => current.length >= 8 ? current : [...current, { option_code: String.fromCharCode(65 + current.length), option_text: "", is_correct: false }]);
  }

  function removeOption(index: number) {
    setOptions((current) => {
      if (current.length <= 2) return current;
      const removedCorrect = current[index]?.is_correct;
      const next = current.filter((_, optionIndex) => optionIndex !== index).map((option, optionIndex) => ({ ...option, option_code: String.fromCharCode(65 + optionIndex) }));
      if (removedCorrect && next[0]) next[0] = { ...next[0], is_correct: true };
      return next;
    });
  }

  function addTag(value: string, kind: "keyword" | "taxonomy") {
    const normalized = value.trim();
    if (!normalized) return;
    if (kind === "keyword") setMinimumKeywords((current) => current.includes(normalized) ? current : [...current, normalized]);
    else setTaxonomyTags((current) => current.includes(normalized) ? current : [...current, normalized]);
  }

  function removeTag(value: string, kind: "keyword" | "taxonomy") {
    if (kind === "keyword") setMinimumKeywords((current) => current.filter((tag) => tag !== value));
    else {
      const next = taxonomyTags.filter((tag) => tag !== value);
      setTaxonomyTags(next);
      if (correctAnswer === value) setCorrectAnswer(next[0] ?? "");
    }
  }

  return {
    state, pending, handleSubmit, relatedEvidenceIds, toggleEvidence, options, updateOption,
    selectCorrectOption, addOption, removeOption, minimumKeywords, taxonomyTags, addTag,
    removeTag, correctAnswer, setCorrectAnswer, showWarning, setShowWarning,
  };
}
