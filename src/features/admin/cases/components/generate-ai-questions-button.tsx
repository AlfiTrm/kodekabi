import type { AdminCase } from "../types/admin-case";

type GenerateAiQuestionsButtonProps = {
  caseItem: AdminCase;
  disabled?: boolean;
};

export function GenerateAiQuestionsButton(_props: GenerateAiQuestionsButtonProps) {
  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        disabled
        className="flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-purple px-5 text-xs font-semibold text-white opacity-50"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z"/><path d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15Z"/></svg>
        Generate AI Questions
      </button>
      <span role="tooltip" className="pointer-events-none absolute right-0 top-[calc(100%+8px)] whitespace-nowrap rounded-lg border border-border-strong bg-surface-elevated px-3 py-1.5 text-[10px] font-medium text-foreground/70 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
        Coming Soon
      </span>
    </div>
  );
}

