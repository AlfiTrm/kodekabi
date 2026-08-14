import Link from "next/link";

import type { ShopCategoryFilter } from "../types/shop";

const filters: Array<{ label: string; value: ShopCategoryFilter }> = [
  { label: "Semua", value: "all" },
  { label: "Avatar Skin", value: "avatar" },
];

export function ShopCategoryFilter({ value }: { value: ShopCategoryFilter }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Kategori item shop">
      {filters.map((filter) => {
        const active = value === filter.value;
        const href = filter.value === "all" ? "/shop" : `/shop?category=${filter.value}`;
        return (
          <Link
            key={filter.value}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-9 items-center rounded-full border px-5 text-[10px] font-bold transition-colors ${active ? "border-foreground bg-foreground text-button-ink" : "border-border-strong text-foreground/55 hover:border-foreground/35 hover:text-foreground"}`}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
