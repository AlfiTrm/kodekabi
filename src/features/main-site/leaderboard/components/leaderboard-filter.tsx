import { FilterChip } from "@/src/shared/components/ui/filter-chip";

import type { LeaderboardScope } from "../types/leaderboard";

const scopes: Array<{ label: string; value: LeaderboardScope }> = [
  { label: "Minggu ini", value: "weekly" },
  { label: "Teman", value: "friends" },
  { label: "Global", value: "global" },
];

type LeaderboardFilterProps = {
  value: LeaderboardScope;
  onChange: (value: LeaderboardScope) => void;
};

export function LeaderboardFilter({ value, onChange }: LeaderboardFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Cakupan peringkat">
      {scopes.map((scope) => (
        <FilterChip key={scope.value} selected={value === scope.value} onClick={() => onChange(scope.value)}>
          {scope.label}
        </FilterChip>
      ))}
    </div>
  );
}

