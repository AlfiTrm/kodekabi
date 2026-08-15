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
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    setShowModal(false);
    setIsGenerating(true);
    try {
      const res = await generateAiQuestionsAction(caseItem.case_id, caseItem.slug, caseItem.current_case_version_id);
      if (res.error) {
        alert("Gagal menghasilkan pertanyaan: " + res.error);
      } else {
        alert(`Berhasil menambahkan ${res.count} pertanyaan.`);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat memanggil AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button 
        type="button" 
        onClick={() => setShowModal(true)}
        disabled={disabled || isGenerating} 
        className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-purple px-5 text-xs font-semibold text-white transition hover:bg-purple/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z"/><path d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15Z"/></svg>
        {isGenerating ? "Menganalisis..." : "Generate AI Questions"}
      </button>

      {showModal && (
        <ConfirmationModal
          labelledBy="generate-questions-modal-title"
          title="Generate AI Questions"
          description="AI akan menganalisis kasus ini dan membuat 3-5 pertanyaan MCQ secara otomatis. Lanjutkan?"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
    </>
  );
}
