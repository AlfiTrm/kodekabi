import Link from "next/link";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminIcon } from "../../_shared/components/admin-icon";
import type { AdminCase, AdminCaseEvidence } from "../types/admin-case";
import { DeleteEvidenceButton } from "./delete-evidence-button";

type CaseEvidenceTableProps = {
  evidences: AdminCaseEvidence[];
  total: number;
  caseItem: AdminCase;
  failed?: boolean;
};

function evidenceCode(sortOrder: number) {
  return `EV-${String(sortOrder).padStart(2, "0")}`;
}

export function CaseEvidenceTable({ evidences, total, caseItem, failed = false }: CaseEvidenceTableProps) {
  const safeEvidences = Array.isArray(evidences) ? evidences : [];
  const reachedLimit = total >= 5;
  const addEvidenceHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}/evidences/add?caseId=${encodeURIComponent(caseItem.case_id)}`;

  return (
    <section className="mt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold">Evidence Items <span className="ml-1 font-mono text-[10px] font-normal text-foreground/40">({total} evidence)</span></h2>
        <div className="flex flex-wrap gap-2">
          {reachedLimit ? <button type="button" disabled title="Maksimal 5 evidence per case" className="h-10 cursor-not-allowed rounded-full border border-border-strong px-5 text-xs font-semibold text-foreground/45 opacity-55">Batas 5 Evidence</button> : <Link href={addEvidenceHref} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-border-strong px-5 text-xs font-semibold text-foreground transition-colors hover:border-purple hover:text-purple">+ Tambah Evidence</Link>}
          <button type="button" disabled title="Endpoint generate evidence belum tersedia" className="h-10 cursor-not-allowed rounded-full bg-purple px-5 text-xs font-semibold text-white opacity-45">Generate AI (3-5 Evidence)</button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
        {failed ? (
          <AdminEmptyState title="Evidence gagal dimuat" description="Metadata case tetap tersedia. Periksa koneksi API lalu muat ulang halaman." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead className="border-b border-border font-mono text-[9px] uppercase text-foreground/40">
                <tr><th className="px-5 py-4 font-medium">ID</th><th className="px-4 py-4 font-medium">Label</th><th className="px-4 py-4 font-medium">Template Type</th><th className="px-4 py-4 font-medium">Critical</th><th className="px-4 py-4 font-medium">Image</th><th className="px-5 py-4 text-right font-medium">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {safeEvidences.map((evidence) => (
                  <tr key={evidence.case_evidence_id} className="transition-colors hover:bg-white/[0.025]">
                    <td className="px-5 py-3.5 font-mono text-[10px] text-foreground/45">{evidenceCode(evidence.sort_order)}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold">{evidence.label}</td>
                    <td className="px-4 py-3.5 font-mono text-[10px] text-purple">{evidence.template_type}</td>
                    <td className="px-4 py-3.5"><span className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-bold ${evidence.is_critical ? "bg-green/12 text-green" : "bg-surface-muted text-foreground/45"}`}>{evidence.is_critical ? "YES" : "NO"}</span></td>
                    <td className="px-4 py-3.5"><span className={`font-mono text-[9px] ${evidence.has_image ? "text-green" : "text-red"}`}>{evidence.has_image ? "ADA" : "-"}</span></td>
                    <td className="px-5 py-3.5"><div className="flex justify-end gap-2"><Link href={`/admin/cases/${encodeURIComponent(caseItem.slug)}/evidences/${encodeURIComponent(evidence.case_evidence_id)}/edit?caseId=${encodeURIComponent(caseItem.case_id)}&versionId=${encodeURIComponent(caseItem.current_case_version_id)}`} aria-label={`Edit ${evidence.label}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-orange transition-colors hover:border-orange/55 hover:bg-orange/8"><AdminIcon name="edit" className="size-4" /></Link><DeleteEvidenceButton caseItem={caseItem} evidence={evidence} /></div></td>
                  </tr>
                ))}
                {safeEvidences.length === 0 ? <tr><td colSpan={6}><AdminEmptyState title="Belum ada evidence" description="Tambahkan evidence untuk membangun alur investigasi dan melengkapi narasi case." /></td></tr> : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
