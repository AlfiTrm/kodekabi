"use client";

import { AdminSearchField } from "../../_shared/components/admin-search-field";
import { useAdminDirectoryQuery } from "../../_shared/hooks/use-admin-directory-query";

type TitleFiltersProps = {
  search: string;
};

export function TitleFilters({ search }: TitleFiltersProps) {
  const { isPending, searchValue, setSearchValue } = useAdminDirectoryQuery({ search });

  return (
    <div className="flex flex-col gap-3 sm:flex-row" aria-busy={isPending}>
      <AdminSearchField value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Cari title..." pending={isPending} />
    </div>
  );
}
