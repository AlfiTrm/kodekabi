"use client";

import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { AdminSearchField } from "../../_shared/components/admin-search-field";
import { useAdminDirectoryQuery } from "../../_shared/hooks/use-admin-directory-query";

type CaseFiltersProps = {
  search: string;
  status: string;
  difficulty: string;
};

const statusOptions = [
  { value: "all", label: "Semua" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const difficultyOptions = [
  { value: "all", label: "Semua" },
  { value: "low", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "Hard" },
];

export function CaseFilters({ search, status, difficulty }: CaseFiltersProps) {
  const { isPending, searchValue, setSearchValue, updateQuery } = useAdminDirectoryQuery({ search });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-busy={isPending}>
      <AdminSearchField value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Cari judul case..." pending={isPending} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <AdminFilterSelect name="status" label="Status" value={status} options={statusOptions} onChange={(value) => updateQuery({ status: value })} disabled={isPending} />
        <AdminFilterSelect name="difficulty" label="Kesulitan" value={difficulty} options={difficultyOptions} onChange={(value) => updateQuery({ difficulty: value })} disabled={isPending} />
      </div>
    </div>
  );
}
