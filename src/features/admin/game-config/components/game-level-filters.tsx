"use client";

import { AdminSearchField } from "../../_shared/components/admin-search-field";
import { useAdminDirectoryQuery } from "../../_shared/hooks/use-admin-directory-query";

export function GameLevelFilters({ search }: { search: string }) {
  const { isPending, searchValue, setSearchValue } = useAdminDirectoryQuery({ search });
  return <AdminSearchField value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Cari gelar level..." pending={isPending} />;
}
