"use client";

import { useState } from "react";
import { generateAiImageAction } from "../../actions/generate-ai-image-action";
import { ConfirmationModal } from "@/src/shared/components/ui/confirmation-modal";

export function GenerateImageFromPromptButton({ disabled }: { disabled?: boolean }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate = async () => {
    const promptInput = document.querySelector('textarea[name="image_prompt"]') as HTMLTextAreaElement | null;
    const prompt = promptInput?.value.trim();
    
    if (!prompt) {
      setErrorMessage("Silakan isi Image Generation Prompt terlebih dahulu.");
      return;
    }

    setErrorMessage("");
    setIsGenerating(true);
    try {
      const res = await generateAiImageAction(prompt);
      if (res.error || !res.base64) {
        setErrorMessage("Gagal menghasilkan gambar: " + (res.error || "Unknown error"));
        return;
      }

      // Konversi base64 ke File object
      const byteString = atob(res.base64);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: res.mimeType || "image/png" });
      const file = new File([blob], "ai-generated-image.png", { type: res.mimeType || "image/png" });

      // Pasang file ke input file image
      const fileInput = document.querySelector('input[type="file"][name="image"]') as HTMLInputElement | null;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Trigger event change manual agar state UI React terupdate jika ada listener
        const event = new Event("change", { bubbles: true });
        fileInput.dispatchEvent(event);
        
        setShowSuccessModal(true);
      } else {
        setErrorMessage("Input gambar tidak ditemukan di halaman.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat memanggil AI Image Generator.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={disabled || isGenerating}
        className="mt-2 h-9 flex-shrink-0 cursor-pointer rounded-lg bg-purple px-4 text-xs font-semibold text-white transition hover:bg-purple/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? "Sedang Menggambar..." : "Generate & Attach"}
      </button>

      {errorMessage && (
        <ConfirmationModal
          labelledBy="image-error-modal"
          title="Gagal Membuat Gambar"
          description={errorMessage}
          onClose={() => setErrorMessage("")}
          showCloseButton
          footer={
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="h-9 cursor-pointer rounded-lg px-4 text-xs font-medium text-foreground/60 transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              Tutup
            </button>
          }
        />
      )}

      {showSuccessModal && (
        <ConfirmationModal
          labelledBy="image-success-modal"
          title="Gambar Berhasil Dibuat!"
          description="AI telah selesai merender gambar dan langsung dipasangkan ke dalam form. Anda bisa melihat previewnya di atas."
          onClose={() => setShowSuccessModal(false)}
          showCloseButton
          footer={
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="h-9 cursor-pointer rounded-lg bg-purple px-4 text-xs font-medium text-white transition-colors hover:bg-purple/90"
            >
              Oke, Mengerti
            </button>
          }
        />
      )}
    </>
  );
}

