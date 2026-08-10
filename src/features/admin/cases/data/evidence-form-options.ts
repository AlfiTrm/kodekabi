import type { EvidenceTemplateType } from "../types/admin-case";

export const evidenceTemplateOptions: Array<{ value: EvidenceTemplateType; label: string; description: string }> = [
  { value: "social_post", label: "Social Post", description: "postingan media sosial" },
  { value: "article", label: "Article", description: "berita atau artikel investigasi" },
  { value: "blog", label: "Blog", description: "catatan blog pribadi" },
  { value: "forum_thread", label: "Forum Thread", description: "diskusi forum berantai" },
  { value: "chat_transcript", label: "Chat Transcript", description: "rekaman percakapan" },
  { value: "public_announcement", label: "Public Announcement", description: "pengumuman resmi" },
];

export const credibilityTagOptions = [
  { value: "misleading", label: "Misleading" },
  { value: "unverified", label: "Unverified" },
  { value: "satire", label: "Satire" },
  { value: "official_source", label: "Official Source" },
  { value: "emotionally_charged", label: "Emotionally Charged" },
  { value: "out_of_context_statistic", label: "Out of Context" },
];

export function isEvidenceTemplateType(value: string): value is EvidenceTemplateType {
  return evidenceTemplateOptions.some((option) => option.value === value);
}
