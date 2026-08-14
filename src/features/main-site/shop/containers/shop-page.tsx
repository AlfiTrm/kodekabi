import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { getUserLobby } from "@/src/features/main-site/lobby/services/user-lobby-service";
import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { ShopFilters } from "../components/shop-filters";
import { ShopItemCard } from "../components/shop-item-card";
import { ShopPagination } from "../components/shop-pagination";
import { ShopTabs } from "../components/shop-tabs";
import { getUserShopItems } from "../services/user-shop-service";
import type { ShopCategoryFilter as CategoryFilter } from "../types/shop";

type ShopPageProps = {
  category: CategoryFilter;
  search: string;
  page: number;
};

export function ShopPage({ category, search, page }: ShopPageProps) {
  return (
    <main className="min-h-screen flex-1 bg-background pb-20 pt-28 sm:pt-32">
      <SiteContainer>
        <header className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-[-0.04em] sm:text-6xl">Shop<span className="text-orange">.</span></h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-foreground/55 sm:text-sm">Kustomisasi penampilan detektifmu dengan koleksi kosmetik Kota Nusa.</p>
          </div>
          <ShopTabs />
        </header>

        <ShopFilters search={search} category={category} />

        <Suspense key={`${category}|${search}|${page}`} fallback={<ShopLoadingGrid />}>
          <ShopResult category={category} search={search} page={page} />
        </Suspense>
      </SiteContainer>
    </main>
  );
}

async function ShopResult({ category, search, page }: ShopPageProps) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  let result: Awaited<ReturnType<typeof getUserShopItems>>;
  let coinBalance: number | undefined;
  try {
    const [shopResult, lobby] = await Promise.all([
      getUserShopItems({ category, search, page, limit: 12 }, accessToken),
      getUserLobby(accessToken).catch(() => null),
    ]);
    result = shopResult;
    coinBalance = lobby?.profile.coin_balance;
  } catch {
    return <ShopError />;
  }

  const lastPage = Math.max(1, result.pagination.total_pages);
  if (page > lastPage) {
    const query = new URLSearchParams();
    if (category !== "all") query.set("category", category);
    if (search) query.set("search", search);
    query.set("page", String(lastPage));
    const href = `/shop?${query.toString()}`;
    redirect(href);
  }

  if (result.items.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-dashed border-border-strong px-6 py-20 text-center">
        <span aria-hidden="true" className="font-display text-5xl text-orange">?</span>
        <p className="mt-3 text-sm font-semibold">Belum ada item pada kategori ini.</p>
        <p className="mt-2 text-xs text-foreground/45">Koleksi baru akan muncul setelah tersedia di Kota Nusa.</p>
      </section>
    );
  }

  return (
    <>
      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
        {result.items.map((item, index) => <ShopItemCard key={item.item_id} item={item} priority={index < 4} coinBalance={coinBalance} />)}
      </section>
      <ShopPagination pagination={result.pagination} category={category} search={search} />
    </>
  );
}

function ShopError() {
  return (
    <section className="mt-8 rounded-2xl border border-red/25 bg-red/8 px-6 py-16 text-center">
      <p className="text-sm font-semibold text-red">Katalog shop gagal dimuat.</p>
      <p className="mt-2 text-xs text-foreground/50">Periksa koneksi atau sesi akunmu, lalu coba lagi.</p>
      <Link href="/shop" className="mt-5 inline-flex rounded-full border border-red/30 px-5 py-2 text-xs font-semibold text-red hover:bg-red/10">Muat ulang</Link>
    </section>
  );
}

function ShopLoadingGrid() {
  return (
    <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Memuat katalog shop" aria-busy="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="min-h-72 overflow-hidden rounded-2xl border border-border-strong bg-surface">
          <div className="h-44 animate-pulse bg-surface-muted motion-reduce:animate-none" />
          <div className="space-y-3 p-4">
            <div className="h-2 w-20 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
            <div className="mt-5 h-8 animate-pulse rounded-full bg-surface-muted motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </section>
  );
}
