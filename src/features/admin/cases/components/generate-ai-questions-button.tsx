"use client";

import { useState } from "react";
import type { AdminCase } from "../types/admin-case";
import { generateAiQuestionsAction } from "../actions/generate-ai-questions-action";
import { ConfirmationModal } from "@/src/shared/components/ui/confirmation-modal";

type GenerateAiQuestionsButtonProps = {
  caseItem: AdminCase;
  disabled?: boolean;
};

export function GenerateAiQuestionsButton({ caseItem, disabled }: GenerateAiQuestionsButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalState, setModalState] = useState<"confirm" | "success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const handleGenerate = async () => {
    setModalState(null);
    setIsGenerating(true);
    try {
      const res = await generateAiQuestionsAction(caseItem.case_id, caseItem.slug, caseItem.current_case_version_id);
      if (res.error) {
        setModalMessage("Gagal menghasilkan question: " + res.error);
        setModalState("error");
      } else {
        setModalMessage(`Berhasil menambahkan 1 question bertipe "${res.type}" menggunakan AI.`);
        setModalState("success");
      }
    } catch {
      setModalMessage("Terjadi kesalahan saat memanggil AI.");
      setModalState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalState("confirm")}
        disabled={disabled || isGenerating}
        className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-purple px-5 text-xs font-semibold text-white transition hover:bg-purple/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z"/><path d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15Z"/></svg>
        {isGenerating ? "Menganalisis & Menulis..." : "Generate AI Question"}
      </button>

      {modalState === "confirm" && (
        <ConfirmationModal
          labelledBy="generate-question-modal-title"
          title="Generate AI Question"
          description="AI akan memilih satu jenis pertanyaan secara acak (MCQ, Open-ended, Confidence Slider, atau Claim Classification) lalu membuatnya berdasarkan evidence kasus ini. Lanjutkan?"
          onClose={() => setModalState(null)}
          footer={
            <>
              <button
                type="button"
                onClick={() => setModalState(null)}
                className="h-9 cursor-pointer rounded-lg px-4 text-xs font-medium text-foreground/60 transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="h-9 cursor-pointer rounded-lg bg-purple px-4 text-xs font-medium text-white transition-colors hover:bg-purple/90"
              >
                Lanjutkan
              </button>
            </>
          }
        />
      )}

      {(modalState === "success" || modalState === "error") && (
        <ConfirmationModal
          labelledBy="result-modal-title"
          title={modalState === "success" ? "Berhasil!" : "Gagal"}
          description={modalMessage}
          onClose={() => setModalState(null)}
          footer={
            <button
              type="button"
              onClick={() => setModalState(null)}
              className="h-9 cursor-pointer rounded-lg bg-purple px-4 text-xs font-medium text-white transition-colors hover:bg-purple/90"
            >
              Tutup
            </button>
          }
        />
      )}
    </>
  );
}
