import { FilterChip } from "@/src/shared/components/ui/filter-chip";

import type { CaseFilter as CaseFilterValue } from "../types/case";

const filters: Array<{ label: string; value: CaseFilterValue }> = [
  { label: "Semua", value: "all" },
  { label: "Berjalan", value: "ongoing" },
  { label: "Selesai", value: "completed" },
];

type CaseFilterProps = {
  value: CaseFilterValue;
  onChange: (value: CaseFilterValue) => void;
};

export function CaseFilter({ value, onChange }: CaseFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Filter kasus">
      {filters.map((filter) => (
        <FilterChip key={filter.value} selected={value === filter.value} onClick={() => onChange(filter.value)}>
          {filter.label}
        </FilterChip>
      ))}
    </div>
  );
}

