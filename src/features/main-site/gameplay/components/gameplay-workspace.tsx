"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

import { openGameplayEvidenceAction } from "../actions/open-gameplay-evidence-action";
import { saveGameplayAnswersAction } from "../actions/save-gameplay-answers-action";
import { submitGameplaySessionAction } from "../actions/submit-gameplay-session-action";
import type { GameplayAnswer, GameplayEvidence, GameplayQuestion, GameplayResponse, SubmitGameplayResponse } from "../types/gameplay";

type GameplayWorkspaceProps = { sessionId: string; initialData: GameplayResponse };

const toneClasses = ["bg-green", "bg-purple", "bg-blue", "bg-orange", "bg-red"];
type AnswerMap = Record<string, GameplayAnswer>;

export function GameplayWorkspace({ sessionId, initialData }: GameplayWorkspaceProps) {
  const [data, setData] = useState(initialData);
  const [activeEvidenceId, setActiveEvidenceId] = useState(
    initialData.evidences?.find((evidence) => evidence.opened)?.case_evidence_id ?? null,
  );
  const [panel, setPanel] = useState<"questions" | "interrogation">("questions");
  const [paused, setPaused] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitGameplayResponse | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const activeEvidence = data.evidences?.find((evidence) => evidence.case_evidence_id === activeEvidenceId) ?? null;
  const openedCount = data.evidences?.filter((evidence) => evidence.opened).length ?? 0;
  const questionCount = data.questions?.length ?? 0;
  const answeredCount = Object.keys(answers).length;
  const canDecide = data.progress.can_take_decision && answeredCount === questionCount;
  const decisionLabel = canDecide
    ? "Ambil Keputusan"
    : openedCount < (data.evidences?.length ?? 0)
      ? "Buka semua bukti untuk lanjut"
      : answeredCount < questionCount
        ? "Jawab semua pertanyaan untuk lanjut"
        : "Keputusan belum tersedia";

  function openEvidence(evidence: GameplayEvidence) {
    setActiveEvidenceId(evidence.case_evidence_id);
    if (evidence.opened || pending) return;

    startTransition(async () => {
      const result = await openGameplayEvidenceAction(
        sessionId,
        evidence.case_evidence_id,
        data.session.session_version,
        crypto.randomUUID(),
      );

      if (!result.success) return;

      setData((current) => ({
        ...current,
        session: result.data.session,
        progress: result.data.progress,
        evidences: current.evidences?.map((item) => item.case_evidence_id === evidence.case_evidence_id
          ? result.data.evidence
          : item) ?? null,
      }));
    });
  }

  function updateAnswer(answer: GameplayAnswer) {
    setAnswers((current) => ({ ...current, [answer.case_question_id]: answer }));
    setSaved(false);
  }

  function saveAnswers() {
    if (!answers || answeredCount !== questionCount || pending) return;
    startTransition(async () => {
      const result = await saveGameplayAnswersAction(sessionId, data.session.session_version, Object.values(answers), crypto.randomUUID());
      if (!result.success) {
        setSubmitMessage(result.message);
        return;
      }
      setData((current) => ({ ...current, session: result.data.session, progress: result.data.progress }));
      setSaved(true);
    });
  }

  function submitDecision(payload: { final_decision: string; final_confidence: number; reason: string }) {
    startTransition(async () => {
      const result = await submitGameplaySessionAction(sessionId, data.session.session_version, payload, crypto.randomUUID());
      if (!result.success) {
        setSubmitMessage(result.message);
        return;
      }
      setSubmitResult(result.data);
      setDecisionOpen(false);
    });
  }

  if (submitResult) return <GameplayResult result={submitResult} />;

  return (
    <main className="min-h-[calc(100vh-70px)] bg-background text-foreground">
      <header className="flex min-h-16 items-center justify-between gap-5 border-b border-border px-5 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-red font-display text-lg font-bold">#3</span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold">{data.case.title}</h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-foreground/40">Daily case · 2x XP</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex" aria-label={`${openedCount} dari ${data.evidences?.length ?? 0} bukti terbuka`}>
          {data.evidences?.map((evidence, index) => <span key={evidence.case_evidence_id} className={`h-1.5 w-8 rounded-full ${evidence.opened ? toneClasses[index % toneClasses.length] : "bg-surface-muted"}`} />)}
          <span className="ml-2 font-mono text-[9px] text-foreground/40">{openedCount}/{data.evidences?.length ?? 0} bukti</span>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden font-mono text-[9px] text-green sm:inline">● tersimpan</span>
          <button type="button" onClick={() => setPaused(true)} className="rounded-full border border-border-strong px-4 py-2 text-[10px] font-semibold hover:bg-surface">Jeda</button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-134px)] lg:grid-cols-[240px_minmax(0,1fr)_360px]">
        <EvidenceRail evidences={data.evidences ?? []} activeId={activeEvidenceId} onOpen={openEvidence} />
        <EvidenceCanvas evidence={activeEvidence} pending={pending} />
        <aside className="border-l border-border bg-background p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-1 rounded-full bg-surface-muted p-1">
            <button type="button" onClick={() => setPanel("questions")} className={`h-9 rounded-full text-[10px] font-semibold ${panel === "questions" ? "bg-white text-button-ink" : "text-foreground/50"}`}>Pertanyaan</button>
            <button type="button" onClick={() => setPanel("interrogation")} className={`h-9 rounded-full text-[10px] font-semibold ${panel === "interrogation" ? "bg-white text-button-ink" : "text-foreground/50"}`}>Interogasi</button>
          </div>
          {panel === "questions" ? <QuestionPanel questions={data.questions ?? []} answers={answers} onAnswer={updateAnswer} /> : <InterrogationPanel evidence={activeEvidence} />}
          {submitMessage ? <p className="mt-4 rounded-xl border border-red/30 bg-red/8 px-3 py-2 text-[10px] text-red">{submitMessage}</p> : null}
          <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-surface p-3 font-mono text-[9px] uppercase tracking-[0.08em] text-foreground/45">
            <span>Bukti <strong className="text-foreground">{openedCount}/{data.evidences?.length ?? 0}</strong></span>
            <span className="text-right">Jawaban <strong className="text-foreground">{answeredCount}/{questionCount}</strong></span>
          </div>
          <button type="button" onClick={saveAnswers} disabled={answeredCount !== questionCount || pending} className="mt-8 h-11 w-full rounded-full bg-white text-xs font-bold text-button-ink disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35">{pending ? "Menyimpan..." : saved ? "Jawaban tersimpan" : "Simpan jawaban"}</button>
          <button type="button" onClick={() => setDecisionOpen(true)} disabled={!canDecide || pending} className="mt-2 h-11 w-full rounded-full bg-surface-muted text-xs font-bold text-foreground/35 disabled:cursor-not-allowed">{decisionLabel}</button>
        </aside>
      </div>

      {paused ? <PauseModal onClose={() => setPaused(false)} caseTitle={data.case.title} /> : null}
      {decisionOpen ? <DecisionModal caseTitle={data.case.title} pending={pending} onClose={() => setDecisionOpen(false)} onSubmit={submitDecision} /> : null}
    </main>
  );
}

function EvidenceRail({ evidences, activeId, onOpen }: { evidences: GameplayEvidence[]; activeId: string | null; onOpen: (evidence: GameplayEvidence) => void }) {
  return <aside className="border-r border-border p-4 sm:p-6"><p className="font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/45">Papan bukti KODEKABI</p><div className="mt-4 space-y-2">{evidences.map((evidence, index) => <button key={evidence.case_evidence_id} type="button" onClick={() => onOpen(evidence)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${activeId === evidence.case_evidence_id ? "border-purple bg-purple/10" : "border-border bg-surface hover:border-foreground/30"}`}><span className={`size-2 shrink-0 rounded-sm ${toneClasses[index % toneClasses.length]}`} /><span className="min-w-0"><strong className="block truncate text-[11px]">{evidence.label}</strong><small className="block font-mono text-[8px] uppercase text-foreground/35">{evidence.opened ? "Terbuka" : "Belum dibuka"}</small></span></button>)}</div><div className="mt-[min(52vh,480px)] rounded-2xl border border-border bg-surface p-3 text-[10px] text-foreground/45">🕵️ &quot;Teliti semua bukti, detektif!&quot;</div></aside>;
}

function EvidenceCanvas({ evidence, pending }: { evidence: GameplayEvidence | null; pending: boolean }) {
  if (!evidence) return <section className="grid place-items-center p-8 text-center text-sm text-foreground/40">Pilih bukti untuk memulai penyelidikan.</section>;
  const details = evidence[evidence.template_type] as Record<string, unknown> | undefined;
  return <section className="min-w-0 p-5 sm:p-8"><div className="mb-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/40"><span>{evidence.code} · {evidence.template_type}</span><span>{pending ? "Menyimpan..." : evidence.opened ? "Terbuka" : "Belum dibuka"}</span></div><article className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-10"><p className="font-mono text-[9px] uppercase tracking-[0.1em] text-purple">Evidence file</p><h2 className="mt-3 font-display text-3xl font-bold leading-tight">{evidence.label}</h2>{details ? <div className="mt-8 space-y-5 text-sm leading-relaxed text-foreground/70">{Object.entries(details).filter(([key]) => !["image_url", "posts", "messages", "participants"].includes(key)).map(([key, value]) => <div key={key}><dt className="font-mono text-[9px] uppercase tracking-[0.08em] text-foreground/35">{key.replaceAll("_", " ")}</dt><dd className="mt-1">{String(value)}</dd></div>)}</div> : <p className="mt-8 text-sm text-foreground/45">Detail evidence belum tersedia.</p>}</article></section>;
}

function QuestionPanel({ questions, answers, onAnswer }: { questions: GameplayQuestion[]; answers: AnswerMap; onAnswer: (answer: GameplayAnswer) => void }) {
  return <div className="mt-6 space-y-5">{questions.map((question, index) => {
    const answer = answers[question.case_question_id];
    const value = answer?.value ?? {};
    return <div key={question.case_question_id}>
      <p className="text-xs font-semibold">{index + 1} · {question.question_text}</p>
      {question.question_type === "mcq" ? <div className="mt-3 space-y-2">{((question.options as { option_code: string; option_text: string }[] | undefined) ?? []).map((option) => { const selected = value.option_code === option.option_code; return <button key={option.option_code} type="button" onClick={() => onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { option_code: option.option_code }, is_final: true })} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-[10px] transition-colors ${selected ? "border-purple bg-purple/10 text-foreground" : "border-border bg-surface text-foreground/60 hover:border-purple"}`}><span className={`grid size-5 place-items-center rounded-md font-mono text-[9px] ${selected ? "bg-purple text-white" : "bg-surface-muted"}`}>{option.option_code}</span>{option.option_text}</button>; })}</div>
        : question.question_type === "confidence_slider" ? <input type="range" min="0" max="100" step="5" value={Number(value.confidence ?? 50)} onChange={(event) => { const confidence = Number(event.target.value); onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { confidence }, confidence_final: confidence, is_final: true }); }} className="mt-3 w-full accent-purple" />
        : question.question_type === "claim_classification" ? <div className="mt-3 flex flex-wrap gap-2">{((question.claim_classification as string[] | undefined) ?? []).map((classification) => <button key={classification} type="button" onClick={() => onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { classification }, is_final: true })} className={`rounded-full border px-3 py-2 text-[10px] ${value.classification === classification ? "border-blue bg-blue/10 text-blue" : "border-border text-foreground/55"}`}>{classification}</button>)}</div>
        : <textarea value={String(value.text ?? "")} onChange={(event) => onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { text: event.target.value }, is_final: true })} placeholder="Tulis jawabanmu di sini" className="mt-3 min-h-20 w-full resize-y rounded-xl border border-border bg-surface px-3 py-3 text-xs outline-none focus:border-purple" />}
    </div>;
  })}</div>;
}

function InterrogationPanel({ evidence }: { evidence: GameplayEvidence | null }) {
  const chat = evidence?.chat_transcript as { messages?: { sender: string; text: string }[] } | undefined;
  return <div className="mt-6 space-y-4">{chat?.messages?.map((message, index) => <div key={`${message.sender}-${index}`} className={`max-w-[90%] rounded-2xl border border-border bg-surface px-3 py-3 text-xs ${index % 2 ? "ml-auto border-green/50" : ""}`}><p className="mb-1 font-mono text-[8px] text-purple">{message.sender}</p>{message.text}</div>) ?? <p className="text-xs text-foreground/40">Buka evidence chat untuk memulai interogasi.</p>}</div>;
}

function PauseModal({ caseTitle, onClose }: { caseTitle: string; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-background/75 p-5 backdrop-blur-sm"><div className="w-full max-w-xl rounded-3xl border border-border-strong bg-surface shadow-2xl"><div className="flex items-center gap-3 border-b border-border px-6 py-5"><span className="grid size-8 place-items-center rounded-full border border-yellow text-yellow">Ⅱ</span><h2 className="font-display text-2xl font-bold">Permainan terjeda<span className="text-yellow">.</span></h2></div><div className="p-6"><div className="rounded-2xl border border-yellow/35 bg-yellow/8 px-5 py-4 text-sm">Permainan dijeda. Kamu bisa melanjutkan atau kembali ke lobby.</div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between border-b border-border pb-3"><dt className="text-foreground/50">Kasus saat ini</dt><dd className="font-semibold">{caseTitle}</dd></div></dl></div><div className="flex justify-end gap-3 border-t border-border px-6 py-5"><button type="button" onClick={onClose} className="rounded-full border border-border-strong px-5 py-3 text-xs font-semibold">Lanjutkan</button><a href="/lobby" className="rounded-full bg-yellow px-5 py-3 text-xs font-bold text-button-ink">Kembali ke lobby</a></div></div></div>;
}

function DecisionModal({ caseTitle, pending, onClose, onSubmit }: { caseTitle: string; pending: boolean; onClose: () => void; onSubmit: (payload: { final_decision: string; final_confidence: number; reason: string }) => void }) {
  const [decision, setDecision] = useState("mark_misleading");
  const [confidence, setConfidence] = useState(85);
  const [reason, setReason] = useState("");
  return <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-5 backdrop-blur-sm"><form onSubmit={(event) => { event.preventDefault(); onSubmit({ final_decision: decision, final_confidence: confidence, reason }); }} className="w-full max-w-xl rounded-3xl border border-border bg-surface p-6"><h2 className="font-display text-3xl font-bold">Waktunya memutuskan<span className="text-red">.</span></h2><p className="mt-2 text-xs text-foreground/45">Setelah dikirim, keputusan tidak bisa diubah. Kota menunggu.</p><div className="mt-6 space-y-3"><p className="text-xs font-semibold">Vonismu untuk {caseTitle}</p><button type="button" onClick={() => setDecision("mark_misleading")} className={`w-full rounded-xl border px-4 py-3 text-left text-xs ${decision === "mark_misleading" ? "border-red bg-red/10" : "border-border"}`}>Tandai menyesatkan & kirim klarifikasi publik</button><button type="button" onClick={() => setDecision("abstain")} className={`w-full rounded-xl border px-4 py-3 text-left text-xs ${decision === "abstain" ? "border-border-strong bg-background" : "border-border"}`}>Abaikan · biarkan komunitas menilai</button><label className="block pt-3 text-xs font-semibold">Keyakinan final <output className="float-right text-purple">{confidence}%</output><input type="range" min="0" max="100" step="5" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} className="mt-3 w-full accent-purple" /></label><label className="block text-xs font-semibold">Alasanmu <span className="font-normal text-foreground/40">(singkat saja)</span><textarea value={reason} onChange={(event) => setReason(event.target.value)} required className="mt-2 min-h-24 w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-purple" placeholder="Tulis alasan berdasarkan bukti yang kamu buka..." /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-full border border-border-strong px-5 py-3 text-xs font-semibold">Batal</button><button type="submit" disabled={pending || !reason.trim()} className="rounded-full bg-white px-6 py-3 text-xs font-bold text-button-ink disabled:opacity-50">{pending ? "Mengirim..." : "Kunci keputusan"}</button></div></form></div>;
}

function GameplayResult({ result }: { result: SubmitGameplayResponse }) {
  return <main className="min-h-screen bg-background px-5 py-10 sm:px-8"><div className="mx-auto max-w-[880px] text-center"><Image src="/raw/mascot-jacket-think.webp" alt="Maskot KODEKABI sedang berpikir" width={102} height={120} className="mx-auto h-24 w-auto object-contain" /><div className="mt-4 text-3xl text-yellow">★★<span className="text-surface-muted">★</span></div><h1 className="mt-4 font-display text-5xl font-bold uppercase leading-none sm:text-6xl">Kasus terpecahkan<span className="text-green">.</span></h1><div className="mt-4 flex justify-center gap-2 font-mono text-[10px]"><span className="rounded-full bg-purple/15 px-3 py-2 text-purple">+{result.rewards.xp_gained} XP</span><span className="rounded-full bg-yellow/15 px-3 py-2 text-yellow">+{result.rewards.coin_gained} koin</span><span className="rounded-full bg-orange/15 px-3 py-2 text-orange">Skor {result.outcome.total_score}</span></div><div className="mt-8 rounded-3xl bg-green p-6 text-left text-button-ink"><p className="font-mono text-[9px] uppercase tracking-[0.1em]">Yang terjadi di Kota Nusa</p><p className="mt-2 text-sm">{result.outcome.narrative}</p></div><div className="mt-5 grid gap-5 text-left md:grid-cols-[1.2fr_.8fr]"><section className="rounded-3xl border border-border bg-surface p-6"><h2 className="font-display text-xl font-bold">Statistik detektif</h2><div className="mt-5 space-y-4">{result.score_breakdown.map((item) => <div key={item.category_key}><div className="flex justify-between text-[10px] text-foreground/60"><span>{item.category_label}</span><strong>{item.score}</strong></div><div className="mt-2 h-1.5 rounded-full bg-surface-muted"><div className={`h-full rounded-full ${scoreTone(item.category_key)}`} style={{ width: `${item.score}%` }} /></div></div>)}</div></section><div className="space-y-5"><section className="rounded-3xl border border-border bg-surface p-6"><h2 className="font-display text-xl font-bold">Dampak ke kota</h2><div className="mt-4 space-y-3">{result.city_impact.map((item) => <div key={item.key} className="flex justify-between text-xs"><span className="text-foreground/55">{item.label}</span><strong className="text-green">+{item.delta}</strong></div>)}</div></section><section className="rounded-3xl border border-border bg-surface p-6 text-xs text-foreground/65"><p className="font-mono text-[9px] uppercase text-purple">Catatan Kabi · dibantu AI</p><p className="mt-3">{result.feedback.message}</p></section></div></div><a href="/lobby" className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-xs font-bold text-button-ink">Kembali ke lobby</a></div></main>;
}

function scoreTone(categoryKey: string) {
  switch (categoryKey) {
    case "evidence_evaluation": return "bg-blue";
    case "claim_analysis": return "bg-purple";
    case "confidence_calibration": return "bg-orange";
    case "reasoning": return "bg-red";
    case "safety_judgment": return "bg-green";
    default: return "bg-purple";
  }
}
