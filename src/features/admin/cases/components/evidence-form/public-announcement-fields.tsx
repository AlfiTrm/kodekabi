import { EvidenceDateField, EvidenceField, EvidenceTextarea } from "./evidence-form-controls";
import type { AdminCaseEvidenceDetail } from "../../types/admin-case";
import { evidenceDateValue } from "../../utils/evidence-form-values";

export function PublicAnnouncementFields({ disabled, initial }: { disabled: boolean; initial?: AdminCaseEvidenceDetail }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <EvidenceField label="Issuing Body" name="issuing_body" defaultValue={initial?.issuing_body} placeholder="Institusi resmi Kota Nusa" required disabled={disabled} />
      <EvidenceField label="Title" name="title" defaultValue={initial?.title} placeholder="Judul pengumuman resmi" required disabled={disabled} />
      <EvidenceDateField label="Announcement Date" name="date" defaultValue={evidenceDateValue(initial?.date)} min="2020-01-01" max="2100-12-31" required disabled={disabled} containerClassName="md:col-span-2" />
      <EvidenceTextarea label="Body Text" name="body_text" defaultValue={initial?.body_text} placeholder="Tulis isi pengumuman resmi di sini..." required disabled={disabled} containerClassName="md:col-span-2" className="min-h-36" />
    </div>
  );
}
