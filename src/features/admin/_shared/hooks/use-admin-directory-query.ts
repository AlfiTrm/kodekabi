"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useState, useTransition } from "react";

import { buildAdminQueryHref, type AdminQueryUpdate } from "../utils/admin-query";

type UseAdminDirectoryQueryOptions = {
  search: string;
  debounceMs?: number;
};

export function useAdminDirectoryQuery({ search, debounceMs = 400 }: UseAdminDirectoryQueryOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(search);
  const [lastServerSearch, setLastServerSearch] = useState(search);
  const [isPending, startTransition] = useTransition();

  // Browser back/forward updates the draft without remounting and losing focus.
  if (search !== lastServerSearch) {
    setLastServerSearch(search);
    setSearchValue(search);
  }

  function updateQuery(updates: AdminQueryUpdate) {
    const nextUpdates = "search" in updates
      ? updates
      : { ...updates, search: searchValue.trim() };
    const href = buildAdminQueryHref(pathname, searchParams, nextUpdates);
    startTransition(() => router.replace(href, { scroll: false }));
  }

  const commitSearch = useEffectEvent((value: string) => {
    updateQuery({ search: value });
  });

  useEffect(() => {
    const normalizedSearch = searchValue.trim();
    if (normalizedSearch === search) return undefined;

    const timer = window.setTimeout(() => commitSearch(normalizedSearch), debounceMs);
    return () => window.clearTimeout(timer);
  }, [debounceMs, search, searchValue]);

  return { isPending, searchValue, setSearchValue, updateQuery };
}
