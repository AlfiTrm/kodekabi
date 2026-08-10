import type { AdminUserDetail } from "../types/admin-user";

const competencies = [
  ["Evidence Evaluation", "evidence_evaluation_score", "bg-blue"],
  ["Claim Analysis", "claim_analysis_score", "bg-purple"],
  ["Confidence Calibration", "confidence_calibration_score", "bg-orange-shadow"],
  ["Reasoning", "reasoning_score", "bg-red"],
  ["Safety Judgment", "safety_judgment_score", "bg-green"],
] as const;

export function UserCompetencyPanel({ user }: { user: AdminUserDetail }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold uppercase tracking-[-0.02em]">Kompetensi radar.</h2>
      <div className="mt-6 space-y-4">
        {competencies.map(([label, key, color]) => {
          const score = Math.min(100, Math.max(0, user[key]));
          return (
            <div key={key} className="grid items-center gap-2 text-xs sm:grid-cols-[11rem_1fr_2.5rem] sm:gap-4">
              <span className="text-foreground/50">{label}</span>
              <div className="h-2 overflow-hidden rounded-full bg-surface-muted"><span className={`block h-full rounded-full ${color}`} style={{ width: `${score}%` }} /></div>
              <strong className="text-right font-mono text-[10px]">{score}%</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
