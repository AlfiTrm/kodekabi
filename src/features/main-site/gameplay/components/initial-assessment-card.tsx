"use client";

import { useState } from "react";

const assessments = [
  { value: "believable", label: "Bisa dipercaya" },
  { value: "needs_check", label: "Perlu dicek" },
  { value: "misleading", label: "Menyesatkan" },
] as const;

type InitialAssessmentCardProps = {
  initialAssessment: string | null;
  initialConfidence: number | null;
};

export function InitialAssessmentCard({ initialAssessment, initialConfidence }: InitialAssessmentCardProps) {
  const [assessment, setAssessment] = useState(initialAssessment ?? "needs_check");
  const [confidence, setConfidence] = useState(initialConfidence ?? 60);

  return (
    <div className="rounded-[1.35rem] border border-border bg-surface px-5 py-5 sm:px-6">
      <p className="font-display text-lg font-semibold">Tebakan awalmu?</p>
      <p className="mt-1 text-xs leading-relaxed text-foreground/45">Belum lihat bukti. Berubah pikiran nanti malah dapat nilai plus.</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {assessments.map((option) => {
          const active = assessment === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setAssessment(option.value)}
              className={`h-11 rounded-xl border px-3 text-xs font-semibold transition-colors ${active ? "border-purple bg-purple/10 text-foreground" : "border-border-strong text-foreground/65 hover:border-foreground/35 hover:text-foreground"}`}
              aria-pressed={active}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-foreground/45">
          <label htmlFor="initial-confidence">Seberapa yakin?</label>
          <output htmlFor="initial-confidence" className="font-display text-lg font-bold text-purple">{confidence}%</output>
        </div>
        <input
          id="initial-confidence"
          type="range"
          min="0"
          max="100"
          step="5"
          value={confidence}
          onChange={(event) => setConfidence(Number(event.target.value))}
          className="mt-2 h-2 w-full accent-purple"
        />
      </div>
    </div>
  );
}
