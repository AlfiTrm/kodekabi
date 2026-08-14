import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { getUserLobby } from "@/src/features/main-site/lobby/services/user-lobby-service";
import { ShopTabs } from "@/src/features/main-site/shop/components/shop-tabs";
import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { RedeemFilters } from "../components/redeem-filters";
import { RedeemItemCard } from "../components/redeem-item-card";
import { RedeemPagination } from "../components/redeem-pagination";
import { getUserRedeemItems } from "../services/user-redeem-service";
import type { RedeemFilter } from "../types/redeem";

type RedeemPageProps = { search: string; filter: RedeemFilter; page: number };

export function RedeemPage(props: RedeemPageProps) {
  return (
    <main className="min-h-screen flex-1 bg-background pb-20 pt-28 sm:pt-32">
      <SiteContainer>
        <header className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-[-0.04em] sm:text-6xl">Redeem<span className="text-purple">.</span></h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-foreground/55 sm:text-sm">Tukarkan Koin Auditor dengan reward partner Kota Nusa. Kode diberikan langsung setelah transaksi berhasil.</p>
          </div>
          <ShopTabs active="redeem" />
        </header>

        <RedeemFilters search={props.search} filter={props.filter} />
        <Suspense key={`${props.search}|${props.filter}|${props.page}`} fallback={<RedeemSkeleton />}>
          <RedeemResult {...props} />
        </Suspense>
      </SiteContainer>
    </main>
  );
}

async function RedeemResult({ search, filter, page }: RedeemPageProps) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  let data: Awaited<ReturnType<typeof getUserRedeemItems>> | null = null;
  let coinBalance = 0;
  try {
    const [result, lobby] = await Promise.all([
      getUserRedeemItems({ search, page: filter === "owned" ? 1 : page, limit: filter === "owned" ? 100 : 10 }, accessToken),
      getUserLobby(accessToken),
    ]);
    data = result;
    coinBalance = lobby.profile.coin_balance;
  } catch {
    return (
      <section className="mt-5 rounded-2xl border border-red/25 bg-red/8 px-6 py-16 text-center">
        <p className="text-sm font-semibold text-red">Daftar redeem gagal dimuat.</p>
        <p className="mt-2 text-xs text-foreground/50">Periksa koneksi atau sesi akunmu, lalu coba lagi.</p>
        <Link href="/shop/redeem" className="mt-5 inline-flex rounded-full border border-red/30 px-5 py-2 text-xs font-semibold text-red hover:bg-red/10">Muat ulang</Link>
      </section>
    );
  }

  const perPage = 10;
  const ownedItems = filter === "owned" ? data.items.filter((item) => item.user_claim_count > 0) : data.items;
  const items = filter === "owned" ? ownedItems.slice((page - 1) * perPage, page * perPage) : ownedItems;
  const pagination = filter === "owned"
    ? { page, limit: perPage, total: ownedItems.length, total_pages: Math.ceil(ownedItems.length / perPage) }
    : data.pagination;
  const lastPage = Math.max(1, pagination.total_pages);
  if (page > lastPage) redirect(`/shop/redeem${filter !== "all" ? `?filter=${filter}` : ""}`);
  if (items.length === 0) return <RedeemEmpty filtered={filter === "owned" || Boolean(search)} />;

  return (
    <>
      <section className="mt-5 grid gap-4 lg:grid-cols-2" aria-live="polite">
        {items.map((item, index) => <RedeemItemCard key={item.redeem_item_id} initialItem={item} coinBalance={coinBalance} priority={index < 4} />)}
      </section>
      <RedeemPagination pagination={pagination} search={search} filter={filter} />
    </>
  );
}

function RedeemEmpty({ filtered }: { filtered: boolean }) {
  return (
    <section className="mt-5 rounded-2xl border border-dashed border-border-strong px-6 py-20 text-center">
      <span aria-hidden="true" className="font-display text-5xl text-purple">?</span>
      <p className="mt-3 text-sm font-semibold">{filtered ? "Reward yang dicari belum ada." : "Reward belum tersedia."}</p>
      <p className="mt-2 text-xs text-foreground/45">{filtered ? "Ubah pencarian atau filter untuk melihat reward lain." : "Reward partner akan muncul setelah tersedia."}</p>
    </section>
  );
}

function RedeemSkeleton() {
  return (
    <section className="mt-5 grid gap-4 lg:grid-cols-2" aria-label="Memuat reward" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl border border-border-strong bg-surface motion-reduce:animate-none" />)}
    </section>
  );
}
