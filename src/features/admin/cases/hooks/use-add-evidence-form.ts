"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";

import { createAdminEvidenceAction } from "../actions/create-admin-evidence-action";
import { evidenceTemplateOptions } from "../data/evidence-form-options";
import type { AdminCase, EvidenceTemplateType } from "../types/admin-case";

const initialState = { error: null };

export function useAddEvidenceForm(caseItem: AdminCase) {
  const [state, formAction, pending] = useActionState(createAdminEvidenceAction, initialState);
  const [templateType, setTemplateType] = useState<EvidenceTemplateType>("social_post");
  const [credibilityTags, setCredibilityTags] = useState<string[]>([]);
  const [critical, setCritical] = useState(false);
  const [verified, setVerified] = useState(false);
  const selectedTemplate = evidenceTemplateOptions.find((option) => option.value === templateType) ?? evidenceTemplateOptions[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return {
    state,
    handleSubmit,
    pending,
    templateType,
    setTemplateType,
    credibilityTags,
    setCredibilityTags,
    critical,
    setCritical,
    verified,
    setVerified,
    detailTitle: `Detail ${selectedTemplate.label}`,
    detailHref: `/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}#workspace`,
    supportsImage: templateType === "social_post" || templateType === "article",
  };
}
