import type { AdminCase } from "../types/admin-case";

type CaseDetailSummaryProps = {
  caseItem: AdminCase;
};

const statusClasses: Record<string, string> = {
  draft: "bg-surface-muted text-foreground/50",
  published: "bg-green/12 text-green",
  archived: "bg-red/12 text-red",
};

const difficultyClasses: Record<string, string> = {
  low: "bg-green/12 text-green",
  medium: "bg-orange/12 text-orange",
  high: "bg-red/12 text-red",
};

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function CaseDetailSummary({ caseItem }: CaseDetailSummaryProps) {
  return (
    <section className="mt-7 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-5">
        <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-purple/15 text-xl">
          {caseItem.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- Thumbnail hosts are dynamic backend data.
            <img src={caseItem.thumbnail_url} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          ) : <span aria-hidden="true">?</span>}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="truncate font-display text-xl font-semibold sm:text-2xl">{caseItem.title}</h2>
            <span className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-bold uppercase ${statusClasses[caseItem.status] ?? "bg-surface-muted text-foreground/50"}`}>{caseItem.status}</span>
            <span className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-bold uppercase ${difficultyClasses[caseItem.difficulty_level] ?? "bg-surface-muted text-foreground/50"}`}>{caseItem.difficulty_level}</span>
          </div>
          <p className="mt-2 text-xs text-foreground/45">Kategori: {humanize(caseItem.theme)} <span className="mx-1">•</span> Sumber: {humanize(caseItem.generation_source)} <span className="mx-1">•</span> Model: {caseItem.ai_model ?? "Belum diatur"}</p>
        </div>
      </div>

      <dl className="flex shrink-0 gap-8 lg:justify-end">
        <div><dt className="font-mono text-[8px] uppercase text-foreground/35">Durasi</dt><dd className="mt-1 font-mono text-xs font-semibold">{caseItem.estimated_duration_minutes} menit</dd></div>
        <div><dt className="font-mono text-[8px] uppercase text-foreground/35">Risk level</dt><dd className="mt-1 font-mono text-xs font-semibold text-orange">{humanize(caseItem.risk_level)}</dd></div>
      </dl>
    </section>
  );
}
