import { EvidenceDateTimeField, EvidenceField, EvidenceTextarea, EvidenceToggle } from "./evidence-form-controls";
import type { AdminCaseEvidenceDetail } from "../../types/admin-case";
import { evidenceDateTimeValue } from "../../utils/evidence-form-values";

export function SocialPostFields({ disabled, verified, onVerifiedChange, initial }: { disabled: boolean; verified: boolean; onVerifiedChange: (value: boolean) => void; initial?: AdminCaseEvidenceDetail }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <EvidenceField label="Author Name" name="author_name" defaultValue={initial?.author_name} placeholder="Dr. Henry Halu" required disabled={disabled} />
      <EvidenceField label="Author Handle" name="author_handle" defaultValue={initial?.author_handle} placeholder="@henryhalu_real" required disabled={disabled} />
      <EvidenceField label="Platform" name="platform" defaultValue={initial?.platform} placeholder="NusaInsta" required disabled={disabled} />
      <EvidenceDateTimeField label="Timestamp" name="timestamp" defaultValue={evidenceDateTimeValue(initial?.timestamp)} min="2020-01-01T00:00:00" max="2100-12-31T23:59:59" required disabled={disabled} />
      <EvidenceTextarea label="Post Text" name="post_text" defaultValue={initial?.post_text} placeholder="Tulis konten postingan media sosial di sini..." required disabled={disabled} containerClassName="md:col-span-2" />
      <EvidenceField label="Likes Count" name="likes_count" type="number" min={0} defaultValue={initial?.likes_count ?? 0} required disabled={disabled} />
      <EvidenceField label="Shares Count" name="shares_count" type="number" min={0} defaultValue={initial?.shares_count ?? 0} required disabled={disabled} />
      <EvidenceField label="Comments Count" name="comments_count" type="number" min={0} defaultValue={initial?.comments_count ?? 0} required disabled={disabled} />
      <div className="flex items-end pb-2"><EvidenceToggle name="is_verified_account" label="Verified Account?" checked={verified} onChange={onVerifiedChange} disabled={disabled} /></div>
    </div>
  );
}
