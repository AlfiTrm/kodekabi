import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import type { AdminItem, AdminItemCategory } from "../types/admin-item";
import { ItemDetailActions } from "../components/item-detail-actions";

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export function AdminItemDetailPage({ item, categories, edit }: { item: AdminItem; categories: AdminItemCategory[]; edit: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Detail Item" description="Spesifikasi katalog dan pengaturan publikasi item." breadcrumb={<><Link href="/admin/shop" className="hover:text-purple">Shop & Redeem</Link><span className="mx-2">›</span>{item.name}</>} />

      <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <article className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="grid aspect-square w-full shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-background sm:w-52">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- Item hosts are dynamic backend data.
                <img src={item.image_url} alt={item.name} className="size-full object-contain p-4" />
              ) : <span className="text-sm text-foreground/25">Tanpa gambar</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-purple/12 px-3 py-1 text-[9px] font-bold uppercase text-purple">{item.category?.name ?? "Tanpa kategori"}</span>
                <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase ${item.status === "active" ? "bg-green/12 text-green" : "bg-red/12 text-red"}`}>{item.status}</span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em]">{item.name}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/55">{item.description}</p>
              <div className="mt-6">
                <p className="text-[9px] uppercase tracking-wider text-foreground/35">Harga penukaran</p>
                <strong className="mt-1 block font-mono text-2xl text-orange">{new Intl.NumberFormat("id-ID").format(item.price_coin)} <span className="text-base text-foreground/45">●</span></strong>
              </div>
            </div>
          </div>
        </article>

        <aside className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
          <h2 className="font-display text-xl font-semibold">Status katalog</h2>
          <dl className="mt-5 divide-y divide-border text-xs">
            <div className="flex items-center justify-between py-3"><dt className="text-foreground/45">Tampil di toko</dt><dd className={item.is_visible ? "text-green" : "text-red"}>{item.is_visible ? "Ya" : "Tidak"}</dd></div>
            <div className="flex items-center justify-between py-3"><dt className="text-foreground/45">Item unggulan</dt><dd>{item.is_featured ? "Ya" : "Tidak"}</dd></div>
            <div className="flex items-center justify-between py-3"><dt className="text-foreground/45">Kode kategori</dt><dd className="font-mono text-[10px]">{item.category?.code ?? "-"}</dd></div>
            <div className="flex items-start justify-between gap-4 py-3"><dt className="text-foreground/45">Dibuat</dt><dd className="text-right text-[10px]">{dateTimeFormatter.format(new Date(item.created_at))}</dd></div>
            <div className="flex items-start justify-between gap-4 py-3"><dt className="text-foreground/45">Diperbarui</dt><dd className="text-right text-[10px]">{dateTimeFormatter.format(new Date(item.updated_at))}</dd></div>
          </dl>
        </aside>
      </section>
      <div className="mt-5">
        <ItemDetailActions item={item} categories={categories} initiallyEditing={edit} />
      </div>
    </div>
  );
}
