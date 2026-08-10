import { EvidenceDateField, EvidenceField, EvidenceTextarea } from "./evidence-form-controls";
import type { AdminCaseEvidenceDetail } from "../../types/admin-case";
import { evidenceDateValue } from "../../utils/evidence-form-values";

export function BlogFields({ disabled, initial }: { disabled: boolean; initial?: AdminCaseEvidenceDetail }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <EvidenceField label="Title" name="title" defaultValue={initial?.title} placeholder="Judul tulisan blog" required disabled={disabled} containerClassName="md:col-span-2" />
      <EvidenceField label="Author Name" name="author_name" defaultValue={initial?.author_name} placeholder="Budi si Skeptis" required disabled={disabled} />
      <EvidenceField label="Blog Name" name="blog_name" defaultValue={initial?.blog_name} placeholder="HaluTech Insights" required disabled={disabled} />
      <EvidenceDateField label="Publish Date" name="publish_date" defaultValue={evidenceDateValue(initial?.publish_date)} min="2020-01-01" max="2100-12-31" required disabled={disabled} containerClassName="md:col-span-2" />
      <EvidenceTextarea label="Body Text" name="body_text" defaultValue={initial?.body_text} placeholder="Tulis isi tulisan blog lengkap di sini..." required disabled={disabled} containerClassName="md:col-span-2" className="min-h-40" />
    </div>
  );
}
