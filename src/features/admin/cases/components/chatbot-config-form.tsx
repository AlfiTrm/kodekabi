"use client";

import { useActionState, useEffect, useState } from "react";
import { updateChatbotConfigAction } from "../actions/update-chatbot-config-action";
import type { ChatbotConfigResponse } from "../services/admin-cases-service";

type TrashIconProps = { size?: number };

const TrashIcon = ({ size = 16 }: TrashIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z" />
    <path d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15Z" />
  </svg>
);

const WarningIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3 1.8 20.5c-.4.7.1 1.5.9 1.5h18.6c.8 0 1.3-.8.9-1.5L12 3Zm0 5.5c.6 0 1 .4 1 1v4.5c0 .6-.4 1-1 1s-1-.4-1-1V9.5c0-.6.4-1 1-1Zm0 10.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
  </svg>
);

import type { AdminCase } from "../types/admin-case";

type ChatbotConfigFormProps = {
  caseId: string;
  caseItem: AdminCase;
  initialData: ChatbotConfigResponse | null;
};

const initialState = { error: null };

export function ChatbotConfigForm({ caseId, caseItem, initialData }: ChatbotConfigFormProps) {
  const updateActionWithCaseId = updateChatbotConfigAction.bind(null, caseId);
  const [state, formAction, pending] = useActionState(updateActionWithCaseId, initialState);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const [prohibited, setProhibited] = useState<string[]>(
    initialData?.prohibited_behaviors?.length
      ? initialData.prohibited_behaviors
      : ["Jangan memberikan saran medis nyata", "Jangan mengakui bahwa ini simulasi"]
  );

  const [questions, setQuestions] = useState<string[]>(
    initialData?.suggested_questions?.length
      ? initialData.suggested_questions
      : ["Apakah suplemen ini dianjurkan oleh Kementerian Kesehatan?", "Apa saja efek sampingnya?"]
  );
  
  // Controlled inputs for AI population
  const [botName, setBotName] = useState(initialData?.bot_name ?? "");
  const [botPersona, setBotPersona] = useState(initialData?.bot_persona_description ?? "");
  const [knowledgeBoundary, setKnowledgeBoundary] = useState(initialData?.knowledge_boundary ?? "");

  // Sync state if initialData changes (e.g. after revalidation or if wrapped differently)
  useEffect(() => {
    if (initialData) {
      // In case the API returns it wrapped in an array, `config`, `data`, or `chatbot_config`
      const unwrapped = Array.isArray(initialData) ? initialData[0] : initialData;
      const data = unwrapped && typeof unwrapped === "object" 
                   ? ("bot_name" in unwrapped ? unwrapped : 
                     (unwrapped as any).chatbot_config || 
                     (unwrapped as any).config || 
                     (unwrapped as any).data || 
                     unwrapped)
                   : {};
                   
      if (data.bot_name) setBotName(data.bot_name);
      if (data.bot_persona_description) setBotPersona(data.bot_persona_description);
      if (data.knowledge_boundary) setKnowledgeBoundary(data.knowledge_boundary);
      
      if (Array.isArray(data.prohibited_behaviors) && data.prohibited_behaviors.length > 0) {
        setProhibited(data.prohibited_behaviors);
      }
      if (Array.isArray(data.suggested_questions) && data.suggested_questions.length > 0) {
        setQuestions(data.suggested_questions);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (state.success) {
      setSuccessMsg("Konfigurasi chatbot berhasil disimpan.");
      const t = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  const addProhibited = () => {
    setProhibited((items) => [...items, ""]);
  };

  const removeProhibited = (index: number) => {
    setProhibited((items) => items.filter((_, i) => i !== index));
  };

  const updateProhibited = (index: number, value: string) => {
    setProhibited((items) => items.map((item, i) => (i === index ? value : item)));
  };

  const addQuestion = () => {
    setQuestions((items) => [...items, ""]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((items) => items.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    setQuestions((items) => items.map((item, i) => (i === index ? value : item)));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError("");
    
    try {
      const response = await fetch("/api/admin/ai/generate-chatbot-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: caseItem.title,
          short_description: caseItem.short_description
        })
      });
      
      const data = await response.json();
      if (!data.success || !data.config) {
        throw new Error(data.error || "Gagal menghasilkan konfigurasi dari AI.");
      }
      
      const config = data.config as ChatbotConfigResponse;
      setBotName(config.bot_name || "");
      setBotPersona(config.bot_persona_description || "");
      setKnowledgeBoundary(config.knowledge_boundary || "");
      
      if (config.prohibited_behaviors && config.prohibited_behaviors.length > 0) {
        setProhibited(config.prohibited_behaviors);
      }
      
      if (config.suggested_questions && config.suggested_questions.length > 0) {
        setQuestions(config.suggested_questions);
      }
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Terjadi kesalahan saat memanggil AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form action={formAction}>
      {/* =========================================
          GENERATE AI CONFIG
      ========================================== */}
      <section className="mb-8 rounded-2xl border border-border-strong bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              Generate Chatbot Config menggunakan AI
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-foreground/50">
              Buat konfigurasi awal berdasarkan metadata case. Bisa diedit setelah di generate.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={pending || isGenerating}
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-purple px-5 text-xs font-bold text-white transition hover:bg-purple/90 active:scale-95 disabled:opacity-50"
          >
            <SparkleIcon />
            {isGenerating ? "Menganalisis Case..." : "Generate AI Config"}
          </button>
        </div>
        
        {generateError && (
          <div className="mt-4 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">
            {generateError}
          </div>
        )}
      </section>

      {/* =========================================
          PERSONA & BEHAVIOR
      ========================================== */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold tracking-tight text-foreground">
          Persona &amp; Behavior
        </h3>

        <div>
          <label className="mb-2 block text-xs font-semibold text-foreground/80">
            Bot Name
          </label>
          <input
            name="bot_name"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            maxLength={100}
            required
            disabled={pending || isGenerating}
            placeholder="Contoh: Bot_HerbalAjaib_v4.1"
            className="h-11 w-full rounded-xl border border-border-strong bg-background px-3 text-xs text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple focus:ring-1 focus:ring-purple disabled:cursor-not-allowed disabled:opacity-55"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-foreground/80">
            Bot Persona Description
          </label>
          <textarea
            name="bot_persona_description"
            value={botPersona}
            onChange={(e) => setBotPersona(e.target.value)}
            rows={4}
            required
            disabled={pending || isGenerating}
            placeholder="Jelaskan peran AI ini dalam studi kasus..."
            className="min-h-24 w-full resize-y rounded-xl border border-border-strong bg-background px-3 py-3 text-xs leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple focus:ring-1 focus:ring-purple disabled:cursor-not-allowed disabled:opacity-55"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-foreground/80">
            Knowledge Boundary
          </label>
          <textarea
            name="knowledge_boundary"
            value={knowledgeBoundary}
            onChange={(e) => setKnowledgeBoundary(e.target.value)}
            rows={4}
            required
            disabled={pending || isGenerating}
            placeholder="Hanya mengetahui informasi produk..."
            className="min-h-24 w-full resize-y rounded-xl border border-border-strong bg-background px-3 py-3 text-xs leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple focus:ring-1 focus:ring-purple disabled:cursor-not-allowed disabled:opacity-55"
          />
        </div>
      </section>

      <hr className="my-8 border-border" />

      {/* =========================================
          PROHIBITED BEHAVIOR
      ========================================== */}
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">
            Prohibited Behavior
          </h3>
          <p className="mt-1 text-xs text-foreground/50">
            Daftar perilaku yang secara tegas dilarang dilakukan oleh bot.
          </p>
        </div>

        <div className="space-y-2">
          {prohibited.map((item, index) => (
            <div
              key={index}
              className="flex min-h-11 items-center gap-3 rounded-xl border border-red/20 bg-red/5 px-3 transition-colors focus-within:border-red/40 focus-within:bg-red/10"
            >
              <span className="shrink-0 text-red">
                <WarningIcon />
              </span>
              <input
                name="prohibited_behaviors"
                value={item}
                onChange={(e) => updateProhibited(index, e.target.value)}
                disabled={pending}
                placeholder="Masukkan larangan baru..."
                className="min-w-0 flex-1 bg-transparent text-xs text-red outline-none placeholder:text-red/40"
              />
              <button
                type="button"
                onClick={() => removeProhibited(index)}
                disabled={pending}
                aria-label="Remove prohibited behavior"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-red/20 text-red transition-colors hover:bg-red/10 disabled:opacity-50"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addProhibited}
          disabled={pending}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-purple transition-colors hover:text-purple/80 disabled:opacity-50"
        >
          <PlusIcon />
          Tambah Prohibited Behavior
        </button>
      </section>

      <hr className="my-8 border-border" />

      {/* =========================================
          SUGGESTED QUESTIONS
      ========================================== */}
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">
            Suggested Questions for Players
          </h3>
          <p className="mt-1 text-xs text-foreground/50">
            Pertanyaan panduan yang dapat diklik pemain untuk memicu respons spesifik.
          </p>
        </div>

        <div className="space-y-2">
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex min-h-11 items-center gap-3 rounded-xl border border-border-strong bg-background px-3 transition-colors focus-within:border-purple"
            >
              <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-purple/15 text-[10px] font-bold text-purple">
                {index + 1}
              </div>
              <input
                name="suggested_questions"
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                disabled={pending}
                placeholder="Masukkan suggested question baru..."
                className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-foreground/30"
              />
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                disabled={pending}
                aria-label="Remove question"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-50"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          disabled={pending}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-purple transition-colors hover:text-purple/80 disabled:opacity-50"
        >
          <PlusIcon />
          Tambah Suggested Question
        </button>
      </section>

      {/* =========================================
          ERROR / SUCCESS MSG & SAVE
      ========================================== */}
      {state.error && (
        <div className="mt-8 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">
          {state.error}
        </div>
      )}
      {successMsg && (
        <div className="mt-8 rounded-xl border border-green/25 bg-green/8 px-4 py-3 text-xs text-green">
          {successMsg}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="h-11 min-w-40 cursor-pointer rounded-full bg-purple px-6 text-xs font-bold text-white transition hover:bg-purple/90 active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30"
        >
          {pending ? "Menyimpan..." : "Simpan Config"}
        </button>
      </div>
    </form>
  );
}
