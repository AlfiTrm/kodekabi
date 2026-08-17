"use client";

import { useEffect, useState } from "react";
import type { GameplayEvidence } from "../types/gameplay";

const toneClasses = ["bg-green", "bg-purple", "bg-blue", "bg-orange", "bg-red"];
const quotes = [
  "Teliti semua bukti, detektif!",
  "Jangan buru-buru percaya.",
  "Cari konteks sebelum menarik kesimpulan.",
  "Bukti kecil bisa mengubah arah penyelidikan.",
];

export function GameplayEvidenceSidebar({ evidences, activeId, onOpen }: { evidences: GameplayEvidence[]; activeId: string | null; onOpen: (evidence: GameplayEvidence) => void }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [typedQuote, setTypedQuote] = useState("");

  useEffect(() => {
    const quote = quotes[quoteIndex];
    let characterIndex = 0;
    setTypedQuote("");

    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedQuote(quote.slice(0, characterIndex));
      if (characterIndex >= quote.length) {
        window.clearInterval(typingTimer);
        window.setTimeout(() => setQuoteIndex((current) => (current + 1) % quotes.length), 6500);
      }
    }, 75);

    return () => window.clearInterval(typingTimer);
  }, [quoteIndex]);

  return <aside className="flex flex-col border-r border-border p-4 sm:p-6 lg:fixed lg:bottom-0 lg:left-0 lg:top-16 lg:z-20 lg:w-[240px] lg:overflow-y-auto lg:bg-background"><p className="font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/45">Papan bukti KODEKABI</p><div className="mt-4 space-y-2">{evidences.map((evidence, index) => <button key={evidence.case_evidence_id} type="button" onClick={() => onOpen(evidence)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${activeId === evidence.case_evidence_id ? "border-purple bg-purple/10" : "border-border bg-surface hover:border-foreground/30"}`}><span className={`size-2 shrink-0 rounded-sm ${toneClasses[index % toneClasses.length]}`} /><span className="min-w-0"><strong className="block truncate text-[11px]">{evidence.label}</strong><small className="block font-mono text-[8px] uppercase text-foreground/35">{evidence.opened ? "Terbuka" : "Belum dibuka"}</small></span></button>)}</div><div className="mt-auto pt-8 font-mono text-[10px] italic text-purple/70" aria-live="polite">&quot;{typedQuote}<span className="ml-0.5 animate-pulse not-italic">▌</span>&quot;</div></aside>;
}
