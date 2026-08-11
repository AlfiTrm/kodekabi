"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";

import { createAdminQuestionAction } from "../actions/create-admin-question-action";
import type { AdminQuestionType, QuestionMcqOptionDraft } from "../types/admin-case";

const initialState = { error: null };
const initialOptions: QuestionMcqOptionDraft[] = ["A", "B", "C", "D"].map((code, index) => ({
  option_code: code,
  option_text: "",
  is_correct: index === 0,
}));

export function useAddQuestionForm() {
  const [state, formAction, pending] = useActionState(createAdminQuestionAction, initialState);
  const [questionType, setQuestionType] = useState<AdminQuestionType>("mcq");
  const [relatedEvidenceIds, setRelatedEvidenceIds] = useState<string[]>([]);
  const [options, setOptions] = useState<QuestionMcqOptionDraft[]>(initialOptions);
  const [minimumKeywords, setMinimumKeywords] = useState<string[]>(["STR", "izin", "verifikasi", "transparansi"]);
  const [taxonomyTags, setTaxonomyTags] = useState<string[]>(["Fakta", "Opini", "Pengalaman", "Belum Terverifikasi"]);
  const [correctAnswer, setCorrectAnswer] = useState("Belum Terverifikasi");
  const [showWarning, setShowWarning] = useState(true);

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
    else {
      setTaxonomyTags((current) => current.includes(normalized) ? current : [...current, normalized]);
      if (!correctAnswer) setCorrectAnswer(normalized);
    }
  }

  function removeTag(value: string, kind: "keyword" | "taxonomy") {
    if (kind === "keyword") setMinimumKeywords((current) => current.filter((tag) => tag !== value));
    else {
      const nextTags = taxonomyTags.filter((tag) => tag !== value);
      setTaxonomyTags(nextTags);
      if (correctAnswer === value) setCorrectAnswer(nextTags[0] ?? "");
    }
  }

  return {
    state,
    pending,
    handleSubmit,
    questionType,
    setQuestionType,
    relatedEvidenceIds,
    toggleEvidence,
    options,
    updateOption,
    selectCorrectOption,
    addOption,
    removeOption,
    minimumKeywords,
    taxonomyTags,
    addTag,
    removeTag,
    correctAnswer,
    setCorrectAnswer,
    showWarning,
    setShowWarning,
  };
}
