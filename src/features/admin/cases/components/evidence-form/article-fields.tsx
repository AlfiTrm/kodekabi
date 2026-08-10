import { EvidenceDateField, EvidenceField, EvidenceTextarea } from "./evidence-form-controls";
import type { AdminCaseEvidenceDetail } from "../../types/admin-case";
import { evidenceDateValue } from "../../utils/evidence-form-values";

export function ArticleFields({ disabled, initial }: { disabled: boolean; initial?: AdminCaseEvidenceDetail }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <EvidenceField label="Headline" name="headline" defaultValue={initial?.headline} placeholder="Judul artikel investigasi" required disabled={disabled} containerClassName="md:col-span-2" />
      <EvidenceField label="Source Name" name="source_name" defaultValue={initial?.source_name} placeholder="NusaKini News" required disabled={disabled} />
      <EvidenceField label="Author Name" name="author_name" defaultValue={initial?.author_name} placeholder="Redaksi NusaKini" required disabled={disabled} />
      <EvidenceDateField label="Publish Date" name="publish_date" defaultValue={evidenceDateValue(initial?.publish_date)} min="2020-01-01" max="2100-12-31" required disabled={disabled} />
      <EvidenceField label="URL Link (Opsional)" name="url" type="url" defaultValue={initial?.url} placeholder="https://media.nusa/artikel" disabled={disabled} />
      <EvidenceTextarea label="Body Text" name="body_text" defaultValue={initial?.body_text} placeholder="Tulis isi berita lengkap di sini..." required disabled={disabled} containerClassName="md:col-span-2" className="min-h-40" />
    </div>
  );
}
