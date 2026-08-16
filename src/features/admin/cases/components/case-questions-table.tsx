import Link from "next/link";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminIcon } from "../../_shared/components/admin-icon";
import type { AdminCase, AdminCaseQuestion, AdminQuestionType } from "../types/admin-case";
import { DeleteQuestionButton } from "./delete-question-button";
import { GenerateAiQuestionsButton } from "./generate-ai-questions-button";

const questionTypeLabels: Record<AdminQuestionType, string> = {
  mcq: "Multiple Choice",
  open_ended: "Open-ended",
  confidence_slider: "Confidence Slider",
  claim_classification: "Claim Classification",
};

type CaseQuestionsTableProps = {
  questions: AdminCaseQuestion[];
  total: number;
  caseItem: AdminCase;
  failed?: boolean;
};

export function CaseQuestionsTable({ questions, total, caseItem, failed = false }: CaseQuestionsTableProps) {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const addHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}/questions/add?caseId=${encodeURIComponent(caseItem.case_id)}`;

  return (
    <section className="mt-5">
      <div className="rounded-xl border border-orange/55 bg-orange/8 px-4 py-3 text-[11px] leading-5 text-orange">
        Questions mereferensikan evidence yang sudah tersedia. Pastikan tab Evidence sudah terisi sebelum menambahkan pertanyaan.
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold">Investigation Questions <span className="ml-1 font-mono text-[10px] font-normal text-foreground/40">({total} questions)</span></h2>
        <div className="flex flex-wrap gap-2">
          <Link href={addHref} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-border-strong px-5 text-xs font-semibold transition-colors hover:border-purple hover:text-purple">+ Tambah Question</Link>
          <GenerateAiQuestionsButton caseItem={caseItem} disabled={failed} />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
        {failed ? <AdminEmptyState title="Questions gagal dimuat" description="Periksa koneksi API lalu muat ulang halaman." /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] border-collapse text-left">
              <thead className="border-b border-border font-mono text-[9px] uppercase text-foreground/40"><tr><th className="px-5 py-4 font-medium">ID</th><th className="px-4 py-4 font-medium">Pertanyaan</th><th className="px-4 py-4 font-medium">Tipe</th><th className="px-4 py-4 font-medium">Referensi Evidence</th><th className="px-4 py-4 text-right font-medium">Bobot</th><th className="px-5 py-4 text-right font-medium">Aksi</th></tr></thead>
              <tbody className="divide-y divide-border">
                {safeQuestions.map((question) => {
                  const references = Array.isArray(question.related_evidences) ? question.related_evidences : [];
                  const baseHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}/questions/${encodeURIComponent(question.case_question_id)}?caseId=${encodeURIComponent(caseItem.case_id)}&versionId=${encodeURIComponent(caseItem.current_case_version_id)}`;
                  const editHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}/questions/${encodeURIComponent(question.case_question_id)}/edit?caseId=${encodeURIComponent(caseItem.case_id)}&versionId=${encodeURIComponent(caseItem.current_case_version_id)}`;
                  return (
                    <tr key={question.case_question_id} className="transition-colors hover:bg-white/[0.025]">
                      <td className="px-5 py-4 font-mono text-[10px] text-foreground/45">{question.code || `Q-${String(question.sort_order).padStart(2, "0")}`}</td>
                      <td className="max-w-xl px-4 py-4 text-xs font-semibold leading-5">{question.question_text}</td>
                      <td className="px-4 py-4 font-mono text-[10px] text-purple">{questionTypeLabels[question.question_type] ?? question.question_type}</td>
                      <td className="px-4 py-4"><div className="flex max-w-sm flex-wrap gap-1.5">{references.map((evidence) => <span key={evidence.case_evidence_id} title={evidence.label} className="rounded-lg bg-purple/10 px-2 py-1 font-mono text-[9px] text-purple">{evidence.code}</span>)}</div></td>
                      <td className="px-4 py-4 text-right font-mono text-xs font-semibold text-green">{question.scoring_weight}%</td>
                      <td className="px-5 py-4"><div className="flex justify-end gap-2"><Link href={baseHref} aria-label={`Lihat ${question.code}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-foreground/40 transition-colors hover:border-purple/50 hover:bg-purple/8 hover:text-purple"><AdminIcon name="view" className="size-4" /></Link><Link href={editHref} aria-label={`Edit ${question.code}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-foreground/40 transition-colors hover:border-orange/50 hover:bg-orange/8 hover:text-orange"><AdminIcon name="edit" className="size-4" /></Link><DeleteQuestionButton caseItem={caseItem} question={question} /></div></td>
                    </tr>
                  );
                })}
                {safeQuestions.length === 0 ? <tr><td colSpan={6}><AdminEmptyState title="Belum ada question" description="Tambahkan pertanyaan yang menguji kemampuan pemain membaca dan menghubungkan evidence." action={<Link href={addHref} className="text-xs font-semibold text-purple hover:text-purple/75">Tambah question pertama</Link>} /></td></tr> : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
