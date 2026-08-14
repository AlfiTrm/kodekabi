"use client";

import Link from "next/link";

import { useEditEvidenceForm } from "../../hooks/use-edit-evidence-form";
import type { AdminCase, AdminCaseEvidenceDetail } from "../../types/admin-case";
import { ArticleFields } from "./article-fields";
import { BlogFields } from "./blog-fields";
import { ChatTranscriptFields } from "./chat-transcript-fields";
import { CredibilityTagsField, EvidenceField, EvidenceFormSection, EvidenceImageUpload, EvidenceTextarea, EvidenceToggle } from "./evidence-form-controls";
import { ForumThreadFields } from "./forum-thread-fields";
import { PublicAnnouncementFields } from "./public-announcement-fields";
import { SocialPostFields } from "./social-post-fields";

export function EditEvidenceForm({ caseItem, evidence }: { caseItem: AdminCase; evidence: AdminCaseEvidenceDetail }) {
  const form = useEditEvidenceForm(caseItem, evidence);

  function renderFields() {
    switch (form.templateType) {
      case "social_post": return <SocialPostFields disabled={form.pending} verified={form.verified} onVerifiedChange={form.setVerified} initial={evidence} />;
      case "article": return <ArticleFields disabled={form.pending} initial={evidence} />;
      case "blog": return <BlogFields disabled={form.pending} initial={evidence} />;
      case "forum_thread": return <ForumThreadFields disabled={form.pending} initial={evidence} />;
      case "chat_transcript": return <ChatTranscriptFields disabled={form.pending} initial={evidence} />;
      case "public_announcement": return <PublicAnnouncementFields disabled={form.pending} initial={evidence} />;
    }
  }

  return (
    <form onSubmit={form.handleSubmit} className="mt-7 space-y-5">
      <input type="hidden" name="case_id" value={caseItem.case_id} />
      <input type="hidden" name="version_id" value={caseItem.current_case_version_id} />
      <input type="hidden" name="evidence_id" value={evidence.case_evidence_id} />
      <input type="hidden" name="case_slug" value={caseItem.slug} />
      <input type="hidden" name="template_type" value={form.templateType} />
      <input type="hidden" name="sort_order" value={evidence.sort_order} />

      <EvidenceFormSection title="Tipe Evidence">
        <span className="mb-2 block text-xs font-semibold">Template Type</span>
        <div className="flex h-11 items-center rounded-xl border border-border-strong bg-background px-3 text-xs font-semibold text-foreground/65">{form.templateLabel}</div>
      </EvidenceFormSection>

      <EvidenceFormSection title="Informasi Umum">
        <div className="space-y-5">
          <EvidenceField label="Label Evidence" name="label" defaultValue={evidence.label} required disabled={form.pending} />
          <CredibilityTagsField selected={form.credibilityTags} onChange={form.setCredibilityTags} disabled={form.pending} />
          <EvidenceToggle name="is_critical" label="Apakah evidence ini critical?" checked={form.critical} onChange={form.setCritical} disabled={form.pending} />
        </div>
      </EvidenceFormSection>

      <EvidenceFormSection title={`Detail ${form.templateLabel}`}>{renderFields()}</EvidenceFormSection>

      {form.supportsImage ? (
        <EvidenceFormSection title="Visual / Gambar (Opsional)">
          {evidence.image_url ? <p className="mb-3 text-[10px] text-green">Gambar saat ini tersimpan. Upload file hanya jika ingin menggantinya.</p> : null}
          <EvidenceImageUpload disabled={form.pending} />
          <div className="mt-5"><EvidenceTextarea label="Image Generation Prompt" name="image_prompt" defaultValue={evidence.image_prompt} disabled={form.pending} /></div>
        </EvidenceFormSection>
      ) : null}

      {form.state.error ? <p role="alert" className="rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{form.state.error}</p> : null}

      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Link href={form.detailHref} className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground">Batal</Link>
        <button type="submit" disabled={form.pending || form.credibilityTags.length === 0} className="h-10 min-w-40 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">{form.pending ? "Memperbarui..." : "Update Evidence"}</button>
      </div>
    </form>
  );
}
