"use client";

import Link from "next/link";

import { AdminFilterSelect } from "../../../_shared/components/admin-filter-select";
import { evidenceTemplateOptions } from "../../data/evidence-form-options";
import { useAddEvidenceForm } from "../../hooks/use-add-evidence-form";
import type { AdminCase, EvidenceTemplateType } from "../../types/admin-case";
import { ArticleFields } from "./article-fields";
import { BlogFields } from "./blog-fields";
import { ChatTranscriptFields } from "./chat-transcript-fields";
import { CredibilityTagsField, EvidenceField, EvidenceFormSection, EvidenceImageUpload, EvidenceTextarea, EvidenceToggle } from "./evidence-form-controls";
import { ForumThreadFields } from "./forum-thread-fields";
import { PublicAnnouncementFields } from "./public-announcement-fields";
import { SocialPostFields } from "./social-post-fields";
import { GenerateImageFromPromptButton } from "./generate-image-from-prompt-button";

export function AddEvidenceForm({ caseItem, nextSortOrder }: { caseItem: AdminCase; nextSortOrder: number }) {
  const {
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
    detailTitle,
    detailHref,
    supportsImage,
  } = useAddEvidenceForm(caseItem);
  const templateOptions = evidenceTemplateOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  function renderTemplateFields() {
    switch (templateType) {
      case "social_post": return <SocialPostFields disabled={pending} verified={verified} onVerifiedChange={setVerified} />;
      case "article": return <ArticleFields disabled={pending} />;
      case "blog": return <BlogFields disabled={pending} />;
      case "forum_thread": return <ForumThreadFields disabled={pending} />;
      case "chat_transcript": return <ChatTranscriptFields disabled={pending} />;
      case "public_announcement": return <PublicAnnouncementFields disabled={pending} />;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <input type="hidden" name="case_id" value={caseItem.case_id} />
      <input type="hidden" name="version_id" value={caseItem.current_case_version_id} />
      <input type="hidden" name="case_slug" value={caseItem.slug} />
      <input type="hidden" name="sort_order" value={nextSortOrder} />

      <EvidenceFormSection title="Tipe Evidence">
        <span className="mb-2 block text-xs font-semibold">Template Type</span>
        <AdminFilterSelect name="template_type" label="Template" value={templateType} options={templateOptions} onChange={(value) => setTemplateType(value as EvidenceTemplateType)} disabled={pending} showLabel={false} />
      </EvidenceFormSection>

      <EvidenceFormSection title="Informasi Umum">
        <div className="space-y-5">
          <EvidenceField label="Label Evidence" name="label" placeholder="Nama singkat yang tampil pada daftar evidence" required disabled={pending} />
          <CredibilityTagsField selected={credibilityTags} onChange={setCredibilityTags} disabled={pending} />
          <EvidenceToggle name="is_critical" label="Apakah evidence ini critical?" checked={critical} onChange={setCritical} disabled={pending} />
        </div>
      </EvidenceFormSection>

      <EvidenceFormSection title={detailTitle}>
        <div key={templateType}>{renderTemplateFields()}</div>
      </EvidenceFormSection>

      {supportsImage ? (
        <EvidenceFormSection title="Visual / Gambar (Opsional)">
          <EvidenceImageUpload disabled={pending} />
          <div className="mt-5">
            <EvidenceTextarea label="Image Generation Prompt" name="image_prompt" placeholder="Deskripsikan visual evidence untuk image generator..." disabled={pending} />
            <GenerateImageFromPromptButton disabled={pending} />
          </div>
        </EvidenceFormSection>
      ) : null}

      {state.error ? <p role="alert" className="rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}

      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Link href={detailHref} className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground">Batal</Link>
        <button type="submit" disabled={pending || credibilityTags.length === 0} className="h-10 min-w-40 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">{pending ? "Menyimpan..." : "Simpan Evidence"}</button>
      </div>
    </form>
  );
}
