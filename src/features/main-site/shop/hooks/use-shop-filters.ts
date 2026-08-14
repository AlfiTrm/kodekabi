"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { ShopCategoryFilter } from "../types/shop";

export function useShopFilters(initialSearch: string, category: ShopCategoryFilter) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [pending, startTransition] = useTransition();

  function navigate(nextSearch: string, nextCategory: ShopCategoryFilter) {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    if (nextCategory !== "all") params.set("category", nextCategory);
    startTransition(() => {
      router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
    });
  }

  useEffect(() => {
    if (search.trim() === initialSearch) return;
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category !== "all") params.set("category", category);
      startTransition(() => {
        router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [category, initialSearch, pathname, router, search]);

  return {
    search,
    setSearch,
    pending,
    setCategory: (value: ShopCategoryFilter) => navigate(search, value),
  };
}
