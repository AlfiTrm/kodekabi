"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";

import { updateAdminEvidenceAction } from "../actions/update-admin-evidence-action";
import { evidenceTemplateOptions } from "../data/evidence-form-options";
import type { AdminCase, AdminCaseEvidenceDetail, EvidenceTemplateType } from "../types/admin-case";

const initialState = { error: null };

export function useEditEvidenceForm(caseItem: AdminCase, evidence: AdminCaseEvidenceDetail) {
  const [state, formAction, pending] = useActionState(updateAdminEvidenceAction, initialState);
  const [credibilityTags, setCredibilityTags] = useState<string[]>(evidence.credibility_tags ?? []);
  const [critical, setCritical] = useState(Boolean(evidence.is_critical));
  const [verified, setVerified] = useState(Boolean(evidence.is_verified_account));
  const templateType = evidence.template_type as EvidenceTemplateType;
  const template = evidenceTemplateOptions.find((option) => option.value === templateType);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return {
    state,
    pending,
    handleSubmit,
    templateType,
    templateLabel: template?.label ?? evidence.template_type,
    credibilityTags,
    setCredibilityTags,
    critical,
    setCritical,
    verified,
    setVerified,
    detailHref: `/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}#workspace`,
    supportsImage: templateType === "social_post" || templateType === "article",
  };
}
