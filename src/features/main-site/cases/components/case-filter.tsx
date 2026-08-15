import Link from "next/link";

import type { CaseFilter as CaseFilterValue } from "../types/case";

const filters: Array<{ label: string; value: CaseFilterValue }> = [
  { label: "Semua", value: "all" },
  { label: "Berjalan", value: "in_progress" },
  { label: "Selesai", value: "completed" },
];

export function CaseFilter({ value }: { value: CaseFilterValue }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filter kasus">
      {filters.map((filter) => {
        const selected = value === filter.value;

        return (
          <Link
            key={filter.value}
            href={filter.value === "all" ? "/cases" : `/cases?tab=${filter.value}`}
            aria-current={selected ? "page" : undefined}
            className={`inline-flex h-9 items-center justify-center rounded-full border px-5 text-xs font-semibold transition-colors ${selected ? "border-white bg-white text-button-ink" : "border-border-strong text-foreground/50 hover:border-foreground/40 hover:text-foreground"}`}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
