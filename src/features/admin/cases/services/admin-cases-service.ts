import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { AdminCaseDetailResponse, AdminCaseEvidenceDetail, AdminCaseEvidenceDetailResponse, AdminCaseEvidencesResponse, AdminCaseLookups, AdminCaseQuestionsResponse, AdminCasesQuery, AdminCasesResponse, AdminQuestionDetailResponse, AdminQuestionEvidenceOptionsResponse, AdminQuestionType, CreateAdminCaseResponse, CreateAdminEvidenceResponse, CreateAdminQuestionResponse, DeleteAdminCaseResponse, DeleteAdminEvidenceResponse, DeleteAdminQuestionResponse, EvidenceTemplateType, PublishAdminCaseResponse } from "../types/admin-case";

export async function getAdminCases(query: AdminCasesQuery, accessToken: string) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.search) searchParams.set("search", query.search);
  if (query.status && query.status !== "all") searchParams.set("status", query.status);
  if (query.difficulty && query.difficulty !== "all") searchParams.set("difficulty", query.difficulty);

  const result = await serverApi<AdminCasesResponse>(`/admin/cases?${searchParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    cases: Array.isArray(result.cases) ? result.cases : [],
    pagination: result.pagination ?? {
      page: query.page,
      limit: query.limit,
      total: 0,
      total_pages: 0,
    },
  };
}

export async function getAdminCaseLookups(accessToken: string) {
  const result = await serverApi<AdminCaseLookups>("/admin/cases/lookups", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    themes: Array.isArray(result.themes) ? result.themes : [],
    competency_focuses: Array.isArray(result.competency_focuses) ? result.competency_focuses : [],
    difficulty_levels: Array.isArray(result.difficulty_levels) ? result.difficulty_levels : [],
    risk_levels: Array.isArray(result.risk_levels) ? result.risk_levels : [],
    generation_sources: Array.isArray(result.generation_sources) ? result.generation_sources : [],
  };
}

export function createAdminCase(payload: FormData, accessToken: string) {
  return serverApi<CreateAdminCaseResponse, FormData>("/admin/cases", {
    method: "POST",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
    timeoutMs: 30_000,
  });
}

export function deleteAdminCase(caseId: string, accessToken: string) {
  return serverApi<DeleteAdminCaseResponse>(`/admin/cases/${encodeURIComponent(caseId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function publishAdminCase(caseId: string, accessToken: string) {
  return serverApi<PublishAdminCaseResponse>(`/admin/cases/${encodeURIComponent(caseId)}/publish`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

const evidenceEndpointSegments: Record<EvidenceTemplateType, string> = {
  social_post: "social-post",
  article: "article",
  blog: "blog",
  forum_thread: "forum-thread",
  chat_transcript: "chat-transcript",
  public_announcement: "public-announcement",
};

export function createAdminCaseEvidence(
  caseId: string,
  versionId: string,
  templateType: EvidenceTemplateType,
  payload: FormData | Record<string, unknown>,
  accessToken: string,
) {
  const segment = evidenceEndpointSegments[templateType];
  return serverApi<CreateAdminEvidenceResponse, FormData | Record<string, unknown>>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/evidences/${segment}`,
    {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
      timeoutMs: 30_000,
    },
  );
}

export function deleteAdminCaseEvidence(caseId: string, versionId: string, evidenceId: string, accessToken: string) {
  return serverApi<DeleteAdminEvidenceResponse>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/evidences/${encodeURIComponent(evidenceId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
}

export async function getAdminCaseEvidenceDetail(caseId: string, versionId: string, evidenceId: string, accessToken: string) {
  const result = await serverApi<AdminCaseEvidenceDetailResponse | AdminCaseEvidenceDetail>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/evidences/${encodeURIComponent(evidenceId)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const detail = "evidence" in result ? result.evidence : result;
  const template = detail.template_type as EvidenceTemplateType;
  const nested = (detail as Record<string, unknown>)[template] as Record<string, unknown> | undefined;
  const evidence = nested && typeof nested === "object" && !Array.isArray(nested)
    ? ({ ...nested, template_type: detail.template_type } as AdminCaseEvidenceDetail)
    : detail;

  return { evidence };
}

export function updateAdminCaseEvidence(
  caseId: string,
  versionId: string,
  evidenceId: string,
  templateType: EvidenceTemplateType,
  payload: FormData | Record<string, unknown>,
  accessToken: string,
) {
  const segment = evidenceEndpointSegments[templateType];
  return serverApi<CreateAdminEvidenceResponse, FormData | Record<string, unknown>>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/evidences/${encodeURIComponent(evidenceId)}/${segment}`,
    {
      method: "PATCH",
      body: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
      timeoutMs: 30_000,
    },
  );
}

export async function getAdminCaseDetail(caseId: string, accessToken: string) {
  const result = await serverApi<AdminCaseDetailResponse>(`/admin/cases/${encodeURIComponent(caseId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    evidences: Array.isArray(result.evidences) ? result.evidences : [],
  };
}

export async function getAdminCaseEvidences(caseId: string, accessToken: string) {
  const result = await serverApi<AdminCaseEvidencesResponse>(`/admin/cases/${encodeURIComponent(caseId)}/evidences`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    evidences: Array.isArray(result.evidences) ? result.evidences : [],
  };
}

export async function getAdminCaseQuestions(caseId: string, accessToken: string) {
  const result = await serverApi<AdminCaseQuestionsResponse>(`/admin/cases/${encodeURIComponent(caseId)}/questions`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return { ...result, questions: Array.isArray(result.questions) ? result.questions : [] };
}

export async function getAdminQuestionEvidenceOptions(caseId: string, accessToken: string) {
  const result = await serverApi<AdminQuestionEvidenceOptionsResponse>(`/admin/cases/${encodeURIComponent(caseId)}/evidence-options`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return { ...result, evidences: Array.isArray(result.evidences) ? result.evidences : [] };
}

const questionEndpointSegments: Record<AdminQuestionType, string> = {
  mcq: "mcq",
  open_ended: "open-ended",
  confidence_slider: "confidence-slider",
  claim_classification: "claim-classification",
};

export function createAdminCaseQuestion(
  caseId: string,
  versionId: string,
  questionType: AdminQuestionType,
  payload: Record<string, unknown>,
  accessToken: string,
) {
  return serverApi<CreateAdminQuestionResponse, Record<string, unknown>>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/questions/${questionEndpointSegments[questionType]}`,
    {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
}

export async function getAdminCaseQuestionDetail(caseId: string, versionId: string, questionId: string, accessToken: string) {
  const result = await serverApi<AdminQuestionDetailResponse>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/questions/${encodeURIComponent(questionId)}`,
    { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const question = result[result.question_type];
  if (!question) throw new Error("Question detail payload is incomplete.");
  return { question_type: result.question_type, question: { ...question, evidence_references: Array.isArray(question.evidence_references) ? question.evidence_references : [] } };
}

export function updateAdminCaseQuestion(caseId: string, versionId: string, questionId: string, questionType: AdminQuestionType, payload: Record<string, unknown>, accessToken: string) {
  return serverApi<CreateAdminQuestionResponse, Record<string, unknown>>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/questions/${encodeURIComponent(questionId)}/${questionEndpointSegments[questionType]}`,
    { method: "PATCH", body: payload, headers: { Authorization: `Bearer ${accessToken}` } },
  );
}

export function deleteAdminCaseQuestion(caseId: string, versionId: string, questionId: string, accessToken: string) {
  return serverApi<DeleteAdminQuestionResponse>(
    `/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/questions/${encodeURIComponent(questionId)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } },
  );
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function resolveAdminCaseId(slug: string, accessToken: string, caseIdHint?: string) {
  if (caseIdHint && uuidPattern.test(caseIdHint)) return caseIdHint;
  if (uuidPattern.test(slug)) return slug;

  const normalizedSlug = decodeURIComponent(slug).toLocaleLowerCase();
  const searchCandidates = [slug, slug.replaceAll("-", " ")];

  for (const search of searchCandidates) {
    const result = await getAdminCases({ search, page: 1, limit: 20 }, accessToken);
    const matchedCase = result.cases.find((caseItem) => caseItem.slug.toLocaleLowerCase() === normalizedSlug);
    if (matchedCase) return matchedCase.case_id;
  }

  return null;
}

export type ChatbotConfigResponse = {
  bot_name: string;
  bot_persona_description: string;
  knowledge_boundary: string;
  prohibited_behaviors: string[];
  suggested_questions: string[];
};

export async function getAdminCaseChatbotConfig(caseId: string, accessToken: string) {
  return serverApi<ChatbotConfigResponse>(`/admin/cases/${encodeURIComponent(caseId)}/chatbot-config`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateAdminCaseChatbotConfig(caseId: string, payload: Record<string, unknown>, accessToken: string) {
  return serverApi<ChatbotConfigResponse, Record<string, unknown>>(`/admin/cases/${encodeURIComponent(caseId)}/chatbot-config`, {
    method: "PUT",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}


export async function getAdminCaseScoringOutcomeConfig(caseId: string, versionId: string, accessToken: string) {
  return serverApi<import("../types/admin-case").ScoringOutcomeConfigResponse>(`/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/scoring-outcome-config`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateAdminCaseScoringOutcomeConfig(caseId: string, versionId: string, payload: Record<string, unknown>, accessToken: string) {
  return serverApi<import("../types/admin-case").ScoringOutcomeConfigResponse, Record<string, unknown>>(`/admin/cases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(versionId)}/scoring-outcome-config`, {
    method: "PUT",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

