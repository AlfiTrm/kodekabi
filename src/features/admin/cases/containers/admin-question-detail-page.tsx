import Link from "next/link";
import type { ReactNode } from "react";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { questionTypeOptions } from "../data/question-form-options";
import type { AdminCase, AdminQuestionDetail, AdminQuestionEvidenceOption } from "../types/admin-case";

type AdminQuestionDetailPageProps = {
  caseItem: AdminCase;
  question: AdminQuestionDetail;
  evidences: AdminQuestionEvidenceOption[];
};

export function AdminQuestionDetailPage({ caseItem, question, evidences }: AdminQuestionDetailPageProps) {
  const typeLabel = questionTypeOptions.find((option) => option.value === question.question_type)?.label ?? question.question_type;
  const evidenceById = new Map(evidences.map((evidence) => [evidence.case_evidence_id, evidence]));
  const editHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}/questions/${encodeURIComponent(question.case_question_id)}/edit?caseId=${encodeURIComponent(caseItem.case_id)}&versionId=${encodeURIComponent(caseItem.current_case_version_id)}`;
  const caseHref = `/admin/cases/${encodeURIComponent(caseItem.slug)}?caseId=${encodeURIComponent(caseItem.case_id)}&tab=questions#workspace`;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Detail Question"
        description="Tinjau isi pertanyaan, referensi evidence, dan konfigurasi penilaiannya."
        breadcrumb={<><Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link><span className="mx-2">&gt;</span><Link href={caseHref} className="transition-colors hover:text-purple">{caseItem.title}</Link><span className="mx-2">&gt;</span><span className="text-purple">Detail Question</span></>}
        action={<Link href={editHref} className="inline-flex h-10 items-center justify-center rounded-full bg-purple px-5 text-xs font-semibold text-white transition-colors hover:bg-purple/80">Edit Question</Link>}
      />

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-purple/12 px-3 py-1.5 font-mono text-[10px] text-purple">{typeLabel}</span><span className="rounded-lg bg-green/10 px-3 py-1.5 font-mono text-[10px] text-green">{question.scoring_weight}% bobot</span>{question.is_required ? <span className="rounded-lg bg-orange/10 px-3 py-1.5 font-mono text-[10px] text-orange">Wajib</span> : null}</div>
            <h2 className="mt-5 max-w-4xl font-display text-2xl font-semibold leading-tight tracking-[-0.025em] sm:text-3xl">{question.question_text}</h2>
          </section>

          <QuestionTypeDetail question={question} />
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Related Evidence</h2>
          <div className="mt-4 space-y-2">
            {(question.evidence_references ?? []).map((reference) => {
              const evidence = evidenceById.get(reference.case_evidence_id);
              return <div key={reference.case_evidence_id} className="rounded-xl border border-border bg-background p-3"><p className="font-mono text-[9px] text-purple">{evidence?.code ?? `REF-${reference.sort_order}`}</p><p className="mt-1 break-words text-xs font-semibold leading-5">{evidence?.label ?? reference.case_evidence_id}</p></div>;
            })}
            {(question.evidence_references ?? []).length === 0 ? <p className="text-xs leading-5 text-foreground/45">Question ini belum memiliki referensi evidence.</p> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function QuestionTypeDetail({ question }: { question: AdminQuestionDetail }) {
  if (question.question_type === "mcq") {
    return <DetailSection title="Pilihan Jawaban"><div className="space-y-2">{(question.options ?? []).map((option) => <div key={option.option_code} className={`flex items-center gap-3 rounded-xl border p-3 ${option.is_correct ? "border-green/60 bg-green/8" : "border-border bg-background"}`}><span className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-bold ${option.is_correct ? "bg-green text-background" : "bg-surface-muted"}`}>{option.option_code}</span><span className="min-w-0 flex-1 break-words text-xs">{option.option_text}</span>{option.is_correct ? <span className="font-mono text-[9px] text-green">Jawaban benar</span> : null}</div>)}</div>{question.explanation ? <ReadOnlyText label="Penjelasan" value={question.explanation} /> : null}</DetailSection>;
  }
  if (question.question_type === "open_ended") {
    return <DetailSection title="Kriteria Evaluasi"><ReadOnlyText label="Expected Key Points" value={question.expected_key_points} /><TagList label="Minimum Keywords" values={question.minimum_keywords} /><ReadOnlyText label="Evaluation Rubric" value={question.evaluation_rubric} /><Stat label="Max Score" value={question.max_score} /></DetailSection>;
  }
  if (question.question_type === "confidence_slider") {
    return <DetailSection title="Konfigurasi Confidence"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Min" value={question.min_value} /><Stat label="Max" value={question.max_value} /><Stat label="Interval" value={question.snap_interval} /><Stat label="Default" value={question.default_value} /></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><ReadOnlyText label="Label Minimum" value={question.label_low} /><ReadOnlyText label="Label Maximum" value={question.label_high} /></div><p className="mt-4 text-xs text-foreground/50">Peringatan perubahan besar: <strong className="text-foreground">{question.show_warning_on_large_change ? "Aktif" : "Nonaktif"}</strong></p></DetailSection>;
  }
  return <DetailSection title="Taxonomy Klasifikasi"><TagList label="Taxonomy Tags" values={question.taxonomy_tags} /><ReadOnlyText label="Correct Answer" value={question.correct_answer} />{question.explanation ? <ReadOnlyText label="Penjelasan" value={question.explanation} /> : null}</DetailSection>;
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7"><h2 className="font-display text-xl font-semibold text-purple">{title}</h2><div className="mt-5 space-y-4">{children}</div></section>;
}

function ReadOnlyText({ label, value }: { label: string; value?: string }) {
  return <div><p className="text-[10px] font-semibold text-foreground/45">{label}</p><p className="mt-2 break-words rounded-xl border border-border bg-background p-4 text-xs leading-6">{value || "-"}</p></div>;
}

function TagList({ label, values }: { label: string; values?: string[] }) {
  return <div><p className="text-[10px] font-semibold text-foreground/45">{label}</p><div className="mt-2 flex flex-wrap gap-2">{(values ?? []).map((value) => <span key={value} className="rounded-lg bg-purple/10 px-3 py-1.5 font-mono text-[10px] text-purple">{value}</span>)}{(values ?? []).length === 0 ? <span className="text-xs text-foreground/40">-</span> : null}</div></div>;
}

function Stat({ label, value }: { label: string; value?: number }) {
  return <div className="rounded-xl border border-border bg-background p-4"><p className="font-mono text-[9px] uppercase text-foreground/40">{label}</p><p className="mt-2 font-display text-xl font-semibold">{value ?? "-"}</p></div>;
}
