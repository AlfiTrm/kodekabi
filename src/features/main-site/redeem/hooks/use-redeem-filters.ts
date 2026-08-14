"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { RedeemFilter } from "../types/redeem";

export function useRedeemFilters(initialSearch: string, filter: RedeemFilter) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (search.trim() === initialSearch) return;
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filter !== "all") params.set("filter", filter);
      startTransition(() => {
        router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [filter, initialSearch, pathname, router, search]);

  function setFilter(value: RedeemFilter) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (value !== "all") params.set("filter", value);
    startTransition(() => {
      router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
    });
  }

  return { search, setSearch, setFilter, pending };
}
