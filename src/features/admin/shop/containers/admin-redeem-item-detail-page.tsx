import Link from "next/link";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { RedeemItemDetailActions } from "../components/redeem-item-detail-actions";
import type { AdminRedeemItem, AdminRedeemType } from "../types/admin-redeem-item";

const number = new Intl.NumberFormat("id-ID");

export function AdminRedeemItemDetailPage({ item, types, edit }: { item: AdminRedeemItem; types: AdminRedeemType[]; edit: boolean }) {
  return <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <AdminPageHeader title="Detail Item Redeem" description="Spesifikasi penukaran, batas klaim, dan visibilitas item." breadcrumb={<><Link href="/admin/shop?tab=redeem" className="hover:text-purple">Shop & Redeem</Link><span className="mx-2">/</span>{item.name}</>} />
    <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
      <article className="rounded-3xl border border-border bg-surface p-5 sm:p-7"><div className="flex flex-col gap-6 sm:flex-row"><div className="grid aspect-square w-full shrink-0 place-items-center overflow-hidden rounded-2xl bg-background sm:w-52">{item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- Image hosts are dynamic backend data.
        <img src={item.image_url} alt={item.name} className="size-full object-contain p-4" />
      ) : <span className="text-foreground/30">Tanpa gambar</span>}</div><div className="min-w-0"><div className="flex gap-2"><span className="rounded-full bg-green/12 px-3 py-1 text-[9px] font-bold uppercase text-green">{item.type?.name}</span><span className="rounded-full bg-purple/12 px-3 py-1 text-[9px] font-bold uppercase text-purple">{item.status}</span></div><h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em]">{item.name}</h2><p className="mt-2 text-xs text-foreground/45">Partner: {item.partner_name}</p><p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/55">{item.description}</p><strong className="mt-6 block font-mono text-2xl text-orange">{number.format(item.price_coin)} <span className="text-foreground/45">●</span></strong></div></div></article>
      <aside className="rounded-3xl border border-border bg-surface p-5 sm:p-7"><h2 className="font-display text-xl font-semibold">Aturan klaim</h2><dl className="mt-5 divide-y divide-border text-xs"><div className="flex justify-between py-3"><dt className="text-foreground/45">Batas klaim</dt><dd>{item.max_claim_per_period}x per {item.claim_period}</dd></div><div className="flex justify-between py-3"><dt className="text-foreground/45">Level minimum</dt><dd>LV {item.minimum_level}</dd></div><div className="flex justify-between py-3"><dt className="text-foreground/45">Stok terlihat</dt><dd>{item.is_stock_visible ? "Ya" : "Tidak"}</dd></div><div className="flex justify-between py-3"><dt className="text-foreground/45">Kode tipe</dt><dd className="font-mono text-[10px]">{item.type?.code}</dd></div></dl></aside>
    </section>
    <div className="mt-5"><RedeemItemDetailActions item={item} types={types} initiallyEditing={edit} /></div>
  </div>;
}
