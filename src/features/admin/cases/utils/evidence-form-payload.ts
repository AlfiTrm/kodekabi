import type { ChatMessageDraft, EvidenceTemplateType, ForumPostDraft } from "../types/admin-case";

export const multipartEvidenceTemplates = new Set<EvidenceTemplateType>(["social_post", "article", "blog"]);

export function formText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function integer(formData: FormData, name: string, fallback = 0) {
  const value = Number.parseInt(formText(formData, name), 10);
  return Number.isFinite(value) ? value : fallback;
}

function normalizeDateTime(value: string) {
  return value.replace("T", " ");
}

function parseTags(value: string) {
  return [...new Set(value.split(",").map((tag) => tag.trim()).filter(Boolean))];
}

function parseJsonArray<T>(value: string): T[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

export function commonEvidencePayload(formData: FormData) {
  return {
    label: formText(formData, "label"),
    credibility_tags: parseTags(formText(formData, "credibility_tags")),
    is_critical: formData.get("is_critical") === "true",
    sort_order: integer(formData, "sort_order", 1),
  };
}

export function buildEvidenceJsonPayload(templateType: EvidenceTemplateType, formData: FormData) {
  const common = commonEvidencePayload(formData);

  switch (templateType) {
    case "forum_thread": {
      const posts = parseJsonArray<ForumPostDraft>(formText(formData, "posts_json")).map((post) => ({ ...post, timestamp: normalizeDateTime(post.timestamp), upvote_count: Number(post.upvote_count) || 0 }));
      return { ...common, thread_title: formText(formData, "thread_title"), forum_name: formText(formData, "forum_name"), posts };
    }
    case "chat_transcript": {
      const participants = parseJsonArray<string>(formText(formData, "participants_json")).map((participant) => participant.trim()).filter(Boolean);
      const messages = parseJsonArray<ChatMessageDraft>(formText(formData, "messages_json")).map((message) => ({ ...message, timestamp: normalizeDateTime(message.timestamp) }));
      return { ...common, participants, messages };
    }
    case "public_announcement":
      return { ...common, issuing_body: formText(formData, "issuing_body"), title: formText(formData, "title"), date: formText(formData, "date"), body_text: formText(formData, "body_text") };
    default:
      return common;
  }
}

export function buildEvidenceMultipartPayload(templateType: EvidenceTemplateType, formData: FormData) {
  const payload = new FormData();
  const common = commonEvidencePayload(formData);
  payload.set("label", common.label);
  payload.set("credibility_tags", JSON.stringify(common.credibility_tags));
  payload.set("is_critical", String(common.is_critical));
  payload.set("sort_order", String(common.sort_order));

  const fieldsByTemplate: Partial<Record<EvidenceTemplateType, string[]>> = {
    social_post: ["author_name", "author_handle", "platform", "post_text", "timestamp", "likes_count", "shares_count", "comments_count", "is_verified_account", "image_prompt"],
    article: ["headline", "source_name", "author_name", "publish_date", "url", "body_text", "image_prompt"],
    blog: ["title", "author_name", "blog_name", "publish_date", "body_text"],
  };

  for (const field of fieldsByTemplate[templateType] ?? []) {
    const value = formText(formData, field);
    payload.set(field, field === "timestamp" ? normalizeDateTime(value) : value);
  }

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) payload.set("image", image);
  return payload;
}

export function buildEvidencePayload(templateType: EvidenceTemplateType, formData: FormData) {
  return multipartEvidenceTemplates.has(templateType)
    ? buildEvidenceMultipartPayload(templateType, formData)
    : buildEvidenceJsonPayload(templateType, formData);
}
