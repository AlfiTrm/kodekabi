"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import type { AdminDateRange } from "../../_shared/components/admin-date-picker";

type AuditFilterValues = {
  actor: string;
  action: string;
  module: string;
  range: string;
  from: string;
  to: string;
};

export function useAuditLogFilters(initial: AuditFilterValues) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState(initial);
  const [pickerOpen, setPickerOpen] = useState(false);

  function setFilter(name: keyof AuditFilterValues, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function setCustomRange(value: AdminDateRange) {
    setFilters((current) => ({ ...current, range: value.preset ?? "custom", from: value.from, to: value.to }));
  }

  function applyFilters() {
    const next = {
      actor: filters.actor,
      action: filters.action,
      module: filters.module,
      range: filters.range,
      from: filters.range === "custom" ? filters.from : null,
      to: filters.range === "custom" ? filters.to : null,
    };
    startTransition(() => router.replace(buildAdminQueryHref(pathname, searchParams, next), { scroll: false }));
  }

  return { filters, setFilter, setCustomRange, pickerOpen, setPickerOpen, applyFilters, isPending };
}
