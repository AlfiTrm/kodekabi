import { FilterChip } from "@/src/shared/components/ui/filter-chip";

const scopes = ["Minggu ini", "Teman"];

export function LeaderboardFilter() {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Cakupan peringkat">
      {scopes.map((scope) => (
        <FilterChip key={scope} disabled className="cursor-not-allowed opacity-40" title="Cakupan ini belum tersedia">
          {scope}
        </FilterChip>
      ))}
      <FilterChip selected>Global</FilterChip>
    </div>
  );
}
