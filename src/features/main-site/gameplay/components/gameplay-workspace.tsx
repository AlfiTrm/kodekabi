"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";

import { ConfirmationModal } from "@/src/shared/components/ui/confirmation-modal";
import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import { GameplayHeader } from "./gameplay-header";
import { GameplayEvidenceSidebar } from "./gameplay-evidence-sidebar";
import { GameplayInteractionSidebar } from "./gameplay-interaction-sidebar";
import { GameplayDecisionPage } from "./gameplay-decision-page";

import { openGameplayEvidenceAction } from "../actions/open-gameplay-evidence-action";
import { saveGameplayAnswersAction } from "../actions/save-gameplay-answers-action";
import { submitGameplaySessionAction } from "../actions/submit-gameplay-session-action";
import type { GameplayAnswer, GameplayEvidence, GameplayQuestion, GameplayResponse, SubmitGameplayResponse } from "../types/gameplay";

type GameplayWorkspaceProps = { sessionId: string; initialData: GameplayResponse };

type AnswerMap = Record<string, GameplayAnswer>;

export function GameplayWorkspace({ sessionId, initialData }: GameplayWorkspaceProps) {
  const [data, setData] = useState(initialData);
  const [activeEvidenceId, setActiveEvidenceId] = useState(
    initialData.evidences?.find((evidence) => evidence.opened)?.case_evidence_id ?? null,
  );
  const [panel, setPanel] = useState<"questions" | "interrogation">("questions");
  const [paused, setPaused] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>(() => Object.fromEntries(
    (initialData.answers ?? []).map((answer) => [answer.case_question_id, answer]),
  ));
  const [interrogationHistory, setInterrogationHistory] = useState<Array<{ sender: "user" | "assistant"; text: string }>>([]);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitGameplayResponse | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [pending, startTransition] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionVersion = useRef(initialData.session.session_version);
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

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  function openEvidence(evidence: GameplayEvidence) {
    setActiveEvidenceId(evidence.case_evidence_id);
    if (evidence.opened || pending) return;

    startTransition(async () => {
      const result = await openGameplayEvidenceAction(
        sessionId,
        evidence.case_evidence_id,
        sessionVersion.current,
        crypto.randomUUID(),
      );

      if (!result.success) return;

      sessionVersion.current = result.data.session.session_version;
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
    const nextAnswers = { ...answers, [answer.case_question_id]: answer };
    setAnswers(nextAnswers);
    setSubmitMessage(null);
    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      startTransition(async () => {
        const result = await saveGameplayAnswersAction(sessionId, sessionVersion.current, Object.values(nextAnswers), crypto.randomUUID());
        if (!result.success) {
          setSubmitMessage(result.message);
          setSaveStatus("error");
          return;
        }
        sessionVersion.current = result.data.session.session_version;
        setData((current) => ({ ...current, session: result.data.session, progress: result.data.progress }));
        setSaveStatus("saved");
      });
    }, 650);
  }

  function submitDecision(payload: { final_decision: string; final_confidence: number; reason: string }) {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    startTransition(async () => {
      setSubmitMessage(null);
      setSaveStatus("saving");

      const saveResult = await saveGameplayAnswersAction(
        sessionId,
        sessionVersion.current,
        Object.values(answers),
        crypto.randomUUID(),
      );
      if (!saveResult.success) {
        setSubmitMessage(saveResult.message);
        setSaveStatus("error");
        return;
      }

      sessionVersion.current = saveResult.data.session.session_version;
      setData((current) => ({ ...current, session: saveResult.data.session, progress: saveResult.data.progress }));
      setSaveStatus("saved");

      const result = await submitGameplaySessionAction(sessionId, sessionVersion.current, payload, crypto.randomUUID());
      if (!result.success) {
        setSubmitMessage(result.message);
        return;
      }
      setSubmitResult(result.data);
      setDecisionOpen(false);
    });
  }

  if (submitResult) return <GameplayResult result={submitResult} />;
  if (decisionOpen) return <GameplayDecisionPage caseTitle={data.case.title} assessment={String(Object.values(answers).find((answer) => answer.question_type === "mcq")?.value.option_code ?? "Belum dijawab")} classification={String(Object.values(answers).find((answer) => answer.question_type === "claim_classification")?.value.classification ?? "Belum dijawab")} openedEvidenceCount={openedCount} totalEvidenceCount={data.evidences?.length ?? 0} pending={pending} error={submitMessage} onBack={() => setDecisionOpen(false)} onSubmit={submitDecision} />;

  return (
    <main className="min-h-[calc(100vh-70px)] bg-background pt-16 text-foreground">
      <GameplayHeader caseTitle={data.case.title} saveStatus={saveStatus} onPause={() => setPaused(true)} />

      <div className="min-h-[calc(100vh-4rem)] lg:ml-[240px] lg:mr-[360px]">
        <GameplayEvidenceSidebar evidences={data.evidences ?? []} activeId={activeEvidenceId} onOpen={openEvidence} />
        <EvidenceCanvas evidence={activeEvidence} pending={pending} />
        <GameplayInteractionSidebar panel={panel} onPanelChange={setPanel} submitMessage={submitMessage} canDecide={canDecide} pending={pending} decisionLabel={decisionLabel} onDecision={() => setDecisionOpen(true)}>
          {panel === "questions" ? <QuestionPanel questions={data.questions ?? []} answers={answers} pending={pending} onAnswer={updateAnswer} /> : <InterrogationPanel caseCtx={data.case} chatbotConfig={data.chatbot_config} history={interrogationHistory} setHistory={setInterrogationHistory} />}
        </GameplayInteractionSidebar>
      </div>

      {paused ? <PauseModal onClose={() => setPaused(false)} caseTitle={data.case.title} /> : null}
    </main>
  );
}

function EvidenceCanvas({ evidence, pending }: { evidence: GameplayEvidence | null; pending: boolean }) {
  if (!evidence) return <section className="grid min-h-[calc(100vh-4rem)] place-items-center p-8 text-center text-sm text-foreground/40">Pilih bukti untuk memulai penyelidikan.</section>;
  const details = evidence[evidence.template_type] as Record<string, unknown> | undefined;
  const imageUrl = typeof details?.image_url === "string" ? getTrustedImageUrl(details.image_url) : null;
  const headline = typeof details?.headline === "string" ? details.headline : evidence.label;
  const bodyText = typeof details?.body_text === "string" ? details.body_text : null;
  const sourceName = typeof details?.source_name === "string" ? details.source_name : null;
  const authorName = typeof details?.author_name === "string" ? details.author_name : null;
  const publishDate = typeof details?.publish_date === "string" ? details.publish_date : null;

  return <section className="min-w-0 p-5 sm:p-8"><div className="mb-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/40"><span>{evidence.code} · {evidence.template_type}</span><span>{pending ? "Menyimpan..." : evidence.opened ? "Terbuka" : "Belum dibuka"}</span></div><article className={`evidence-paper mx-auto max-w-3xl p-5 sm:p-9 ${evidence.template_type === "article" ? "evidence-newspaper" : ""}`}><header className="border-b-2 border-[#1b1d24]/80 pb-5"><div className="flex items-center justify-between gap-4 border-b border-[#1b1d24]/20 pb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#606676]"><span>{evidence.template_type === "article" ? "Edisi investigasi" : `Bukti ${evidence.template_type.replaceAll("_", " ")}`}</span><span>{publishDate ? formatEvidenceDate(publishDate) : evidence.code}</span></div><div className="mt-5 flex items-end justify-between gap-4"><h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#171922] sm:text-5xl">{evidence.template_type === "article" ? "Koran Nusa" : "Berkas Bukti"}<span className="text-red">.</span></h2><span className="hidden font-mono text-[9px] uppercase text-[#606676] sm:block">{evidence.code}</span></div></header>{evidence.template_type === "article" ? <div className="pt-6"><h3 className="max-w-2xl font-display text-3xl font-black leading-[0.98] tracking-[-0.03em] text-[#171922] sm:text-5xl">{headline}</h3><p className="mt-4 text-xs text-[#606676]">{sourceName ?? "Redaksi Nusa"} · Ditulis oleh <strong className="text-[#171922]">{authorName ?? "Redaksi"}</strong>{publishDate ? ` · ${formatEvidenceDate(publishDate)}` : ""}</p>{imageUrl ? <div className="relative mt-7 aspect-[16/7] overflow-hidden rounded-xl bg-[#e9ebee]"><Image src={imageUrl} alt="Ilustrasi artikel evidence" fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover grayscale-[20%]" /></div> : <div className="mt-7 grid min-h-28 place-items-center rounded-xl bg-[#e9ebee] px-6 text-center font-mono text-xs text-[#606676]">[ FOTO DAN DOKUMEN PENDUKUNG ]</div>}{bodyText ? <div className="mt-7 space-y-4 text-[15px] leading-7 text-[#30333d]"><p>{bodyText}</p></div> : null}</div> : <div className="pt-6"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#606676]">Evidence file · {evidence.label}</p>{imageUrl ? <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-xl bg-[#e9ebee]"><Image src={imageUrl} alt="Lampiran evidence" fill sizes="(max-width: 768px) 100vw, 640px" className="object-contain" /></div> : null}{details ? <dl className="mt-7 grid gap-5 text-sm leading-relaxed text-[#30333d] sm:grid-cols-2">{Object.entries(details).filter(([key]) => !["image_url", "posts", "messages", "participants"].includes(key)).map(([key, value]) => <div key={key} className="border-t border-[#1b1d24]/15 pt-3"><dt className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#606676]">{key.replaceAll("_", " ")}</dt><dd className="mt-1">{formatEvidenceValue(key, value)}</dd></div>)}</dl> : <p className="mt-8 text-sm text-[#606676]">Detail evidence belum tersedia.</p>}</div>}</article></section>;
}

function formatEvidenceDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatEvidenceValue(key: string, value: unknown) {
  if (["date", "publish_date", "announcement_date", "timestamp"].includes(key) && typeof value === "string") {
    return formatEvidenceDate(value);
  }

  return String(value);
}

function QuestionPanel({ questions, answers, pending, onAnswer }: { questions: GameplayQuestion[]; answers: AnswerMap; pending: boolean; onAnswer: (answer: GameplayAnswer) => void }) {
  return <div className="mt-6 space-y-5">{questions.map((question, index) => {
    const answer = answers[question.case_question_id];
    const value = answer?.value ?? {};
    return <div key={question.case_question_id}>
      <p className="text-xs font-semibold">{index + 1} · {question.question_text}</p>
      {question.question_type === "mcq" ? <div className="mt-3 space-y-2">{((question.options as { option_code: string; option_text: string }[] | undefined) ?? []).map((option) => { const selected = value.option_code === option.option_code; return <button key={option.option_code} type="button" disabled={pending} onClick={() => onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { option_code: option.option_code }, is_final: true })} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${selected ? "border-purple bg-purple/10 text-foreground" : "border-border bg-surface text-foreground/60 hover:border-purple"}`}><span className={`grid size-5 place-items-center rounded-md font-mono text-[9px] ${selected ? "bg-purple text-white" : "bg-surface-muted"}`}>{option.option_code}</span>{option.option_text}</button>; })}</div>
        : question.question_type === "confidence_slider" ? <input type="range" min="0" max="100" step="5" value={Number(value.confidence ?? 50)} disabled={pending} onChange={(event) => { const confidence = Number(event.target.value); onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { confidence }, confidence_final: confidence, is_final: true }); }} className="mt-3 w-full accent-purple disabled:cursor-not-allowed disabled:opacity-60" />
          : question.question_type === "claim_classification" ? <div className="mt-3 flex flex-wrap gap-2">{((question.claim_classification as string[] | undefined) ?? []).map((classification) => <button key={classification} type="button" disabled={pending} onClick={() => onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { classification }, is_final: true })} className={`rounded-full border px-3 py-2 text-[10px] disabled:cursor-not-allowed disabled:opacity-60 ${value.classification === classification ? "border-blue bg-blue/10 text-blue" : "border-border text-foreground/55"}`}>{classification}</button>)}</div>
            : <textarea value={String(value.text ?? "")} disabled={pending} onChange={(event) => onAnswer({ case_question_id: question.case_question_id, question_type: question.question_type, value: { text: event.target.value }, is_final: true })} placeholder="Tulis jawabanmu di sini" className="mt-3 min-h-20 w-full resize-y rounded-xl border border-border bg-surface px-3 py-3 text-xs outline-none focus:border-purple disabled:cursor-not-allowed disabled:opacity-60" />}
    </div>;
  })}</div>;
}

import { chatInterrogationAction } from "../actions/chat-interrogation-action";

function InterrogationPanel({ caseCtx, chatbotConfig, history, setHistory }: { caseCtx: import("../types/gameplay").GameplayCase; chatbotConfig: import("../types/gameplay").GameplayChatbotConfig | null; history: Array<{ sender: "user" | "assistant", text: string }>; setHistory: (history: Array<{ sender: "user" | "assistant", text: string }>) => void; }) {
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const characterName = chatbotConfig?.bot_name || "Saksi / Korban";
  const avatarUrl = "";
  const quickPrompts = chatbotConfig?.suggested_questions || [];

  const messages = history.length > 0 ? history : ([]);

  async function sendMessage(message: string) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !chatbotConfig || isTyping) return;

    // Optimistic update
    const newHistory = [...messages, { sender: "user" as const, text: trimmedMessage }];
    setHistory(newHistory);
    setDraft("");
    setIsTyping(true);

    const result = await chatInterrogationAction(chatbotConfig, caseCtx, messages, trimmedMessage);

    setIsTyping(false);
    if (result.success && result.text) {
      setHistory([...newHistory, { sender: "assistant" as const, text: result.text }]);
    } else {
      alert("Gagal menghubungi saksi: " + (result.error || "Unknown error"));
      // Rollback on fail
      setHistory(messages);
    }
  }

  if (!chatbotConfig) {
    return (
      <div className="mt-6 flex min-h-0 flex-1 flex-col items-center justify-center p-6 text-center text-sm text-foreground/50">
        Kasus ini tidak memiliki saksi/korban untuk diinterogasi.
      </div>
    );
  }

  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col pb-6">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        <div className="flex items-center gap-3 px-1">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={characterName} className="size-9 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-purple text-sm font-bold text-white">{characterName.charAt(0)}</span>
          )}
          <div><strong className="block text-xs">{characterName}</strong><span className="text-[9px] text-green">Online</span></div>
        </div>
        {messages.map((message, index) => <div key={`${message.sender}-${index}`} className={`max-w-[90%] rounded-2xl border border-border px-3 py-3 text-xs leading-relaxed ${message.sender === "assistant" ? "bg-surface" : "ml-auto border-green/60 bg-green/10"}`}>{message.text}</div>)}
        {isTyping && <div className="max-w-[90%] rounded-2xl border border-border bg-surface px-3 py-3 text-xs leading-relaxed text-foreground/50">Sedang mengetik...</div>}
      </div>
      <div className="mt-5 shrink-0">
        {quickPrompts.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {quickPrompts.map((prompt) => <button key={prompt} type="button" disabled={isTyping} onClick={() => sendMessage(prompt)} className="shrink-0 rounded-full border border-border-strong px-3 py-2 text-[10px] text-foreground/55 transition-colors hover:border-purple hover:text-foreground disabled:opacity-50">{prompt}</button>)}
          </div>
        )}
        <p className="mt-2 text-[10px] text-foreground/35">Tulis pertanyaan untuk menggali informasi lebih lanjut</p>
        <form onSubmit={(event) => { event.preventDefault(); sendMessage(draft); }} className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 focus-within:border-purple">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} disabled={isTyping} className="min-w-0 flex-1 bg-transparent px-1 py-2 text-xs outline-none placeholder:text-foreground/35 disabled:opacity-50" placeholder="Atau tanya sendiri" aria-label="Pertanyaan interogasi" />
          <button type="submit" disabled={isTyping} className="px-1 py-2 text-xs font-semibold text-purple disabled:opacity-50">Kirim</button>
        </form>
      </div>
    </div>
  );
}

function PauseModal({ caseTitle, onClose }: { caseTitle: string; onClose: () => void }) {
  return (
    <ConfirmationModal
      labelledBy="gameplay-pause-title"
      title="Permainan Terjeda."
      onClose={onClose}
      showCloseButton
      className="max-w-[750px] rounded-[32px]"
      leading={<span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-yellow text-xl font-bold text-yellow" aria-hidden="true">Ⅱ</span>}
      footer={(
        <>
          <a href="/lobby" className="inline-flex h-12 min-w-40 items-center justify-center rounded-full border border-border-strong px-6 text-sm font-semibold text-foreground/60 transition-colors hover:bg-surface-muted hover:text-foreground">Kembali ke Lobby</a>
          <button type="button" onClick={onClose} className="inline-flex h-12 min-w-40 items-center justify-center rounded-full bg-yellow px-6 text-sm font-bold text-button-ink transition-colors hover:bg-yellow/85">Lanjutkan</button>
        </>
      )}
    >
      <div className="rounded-2xl border border-yellow/35 bg-yellow/8 px-6 py-5 text-base text-foreground/85">Permainan dijeda. Kamu bisa melanjutkan atau kembali ke lobby.</div>
      <dl className="mt-7 space-y-4 text-base">
        <div className="flex items-center justify-between border-b border-border pb-4"><dt className="text-foreground/55">Kasus Saat Ini</dt><dd className="font-semibold">{caseTitle}</dd></div>
        <div className="flex items-center justify-between"><dt className="text-foreground/55">Estimasi Skor</dt><dd className="font-mono font-bold text-yellow">● +450 koin</dd></div>
      </dl>
    </ConfirmationModal>
  );
}

function GameplayResult({ result }: { result: SubmitGameplayResponse }) {
  return <main className="relative min-h-screen overflow-hidden bg-background px-5 py-10 sm:px-8"><Confetti /><div className="relative z-10 mx-auto max-w-[880px] text-center"><Image src="/mascot/mascot-jacket.webp" alt="Maskot KODEKABI" width={102} height={120} className="mx-auto h-24 w-auto object-contain" /><div className="mt-4 text-3xl text-yellow">★★<span className="text-surface-muted">★</span></div><h1 className="mt-4 font-display text-5xl font-bold uppercase leading-none sm:text-6xl">Kasus terpecahkan<span className="text-green">.</span></h1><div className="mt-4 flex justify-center gap-2 font-mono text-[10px]"><span className="rounded-full bg-purple/15 px-3 py-2 text-purple">+{result.rewards.xp_gained} XP</span><span className="rounded-full bg-yellow/15 px-3 py-2 text-yellow">+{result.rewards.coin_gained} koin</span><span className="rounded-full bg-orange/15 px-3 py-2 text-orange">Skor {result.outcome.total_score}</span></div><div className="mt-8 rounded-3xl bg-green p-6 text-left text-button-ink"><p className="font-mono text-[9px] uppercase tracking-[0.1em]">Yang terjadi di Kota Nusa</p><p className="mt-2 text-sm">{result.outcome.narrative}</p></div><div className="mt-5 grid gap-5 text-left md:grid-cols-[1.2fr_.8fr]"><section className="rounded-3xl border border-border bg-surface p-6"><h2 className="font-display text-xl font-bold">Statistik detektif</h2><div className="mt-5 space-y-4">{result.score_breakdown.map((item) => <div key={item.category_key}><div className="flex justify-between text-[10px] text-foreground/60"><span>{item.category_label}</span><strong>{item.score}</strong></div><div className="mt-2 h-1.5 rounded-full bg-surface-muted"><div className={`h-full rounded-full ${scoreTone(item.category_key)}`} style={{ width: `${item.score}%` }} /></div></div>)}</div></section><div className="space-y-5"><section className="rounded-3xl border border-border bg-surface p-6"><h2 className="font-display text-xl font-bold">Dampak ke kota</h2><div className="mt-4 space-y-3">{result.city_impact.map((item) => <div key={item.key} className="flex justify-between text-xs"><span className="text-foreground/55">{item.label}</span><strong className="text-green">+{item.delta}</strong></div>)}</div></section><section className="rounded-3xl border border-border bg-surface p-6 text-xs text-foreground/65"><p className="font-mono text-[9px] uppercase text-purple">Catatan Kabi · dibantu AI</p><p className="mt-3">{result.feedback.message}</p></section></div></div><a href="/lobby" className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-xs font-bold text-button-ink">Kembali ke lobby</a></div></main>;
}

const confettiPieces = [
  ["8%", "8%", "#f87171", "0.1s"], ["18%", "2%", "#facc15", "0.35s"], ["31%", "10%", "#a78bfa", "0.2s"],
  ["46%", "1%", "#60a5fa", "0.5s"], ["61%", "9%", "#4ade80", "0.25s"], ["76%", "3%", "#fb923c", "0.45s"],
  ["91%", "12%", "#f87171", "0.15s"], ["12%", "24%", "#60a5fa", "0.65s"], ["84%", "25%", "#a78bfa", "0.55s"],
] as const;

function Confetti() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 overflow-hidden">{confettiPieces.map(([left, top, color, delay], index) => <span key={index} className="confetti-piece" style={{ left, top, backgroundColor: color, animationDelay: delay }} />)}</div>;
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



