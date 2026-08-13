import Link from "next/link";
import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminIcon } from "../../_shared/components/admin-icon";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import type { AdminRedeemItem, AdminRedeemItemsPagination } from "../types/admin-redeem-item";

const number = new Intl.NumberFormat("id-ID");

export function RedeemItemsTable({ items, pagination }: { items: AdminRedeemItem[]; pagination: AdminRedeemItemsPagination }) {
  const safeItems = Array.isArray(items) ? items : [];
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  return (
    <AdminTableShell footer={<><p className="text-[10px] text-foreground/40">Menampilkan {start}-{end} dari {number.format(pagination.total)} item redeem</p><AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={(page) => `/admin/shop?tab=redeem&page=${page}`} /></>}>
      <table className="w-full min-w-[1120px] border-collapse text-left">
        <thead className="border-b border-border text-[9px] uppercase text-foreground/45"><tr><th className="px-5 py-4 font-medium">Gambar</th><th className="px-4 py-4 font-medium">Nama Item</th><th className="px-4 py-4 font-medium">Tipe</th><th className="px-4 py-4 font-medium">Partner</th><th className="px-4 py-4 font-medium">Harga Koin</th><th className="px-4 py-4 font-medium">Klaim/Periode</th><th className="px-4 py-4 font-medium">Min. Level</th><th className="px-4 py-4 font-medium">Stok</th><th className="px-4 py-4 font-medium">Status</th><th className="sticky right-0 bg-surface px-5 py-4 text-right font-medium">Aksi</th></tr></thead>
        <tbody className="divide-y divide-border">
          {safeItems.map((item) => <tr key={item.redeem_item_id} className="group hover:bg-white/[0.025]">
            <td className="px-5 py-3"><span className="block size-11 overflow-hidden rounded-xl border border-border bg-background">{item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- Image hosts are dynamic backend data.
              <img src={item.image_url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
            ) : null}</span></td>
            <td className="px-4 py-3 text-xs font-semibold">{item.name}</td>
            <td className="px-4 py-3"><span className="rounded-full bg-green/12 px-2.5 py-1 text-[8px] font-bold uppercase text-green">{item.type?.name ?? "-"}</span></td>
            <td className="px-4 py-3 text-[10px] text-foreground/55">{item.partner_name}</td>
            <td className="px-4 py-3 font-mono text-[10px] text-orange">{number.format(item.price_coin)} <span className="text-foreground/45">●</span></td>
            <td className="px-4 py-3 text-[10px] text-foreground/55">{item.max_claim_per_period}x/{item.claim_period}</td>
            <td className="px-4 py-3 text-[10px]">LV {item.minimum_level}</td>
            <td className="px-4 py-3 text-[9px] text-foreground/55">{item.is_stock_visible ? "Tampil" : "Tersembunyi"}</td>
            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase ${item.status === "active" ? "bg-green/12 text-green" : "bg-surface-muted text-foreground/40"}`}>{item.status}</span></td>
            <td className="sticky right-0 bg-surface px-5 py-3 group-hover:bg-surface-elevated"><div className="flex justify-end gap-2"><Link href={`/admin/shop/redeem/${item.redeem_item_id}`} className="grid size-9 place-items-center rounded-xl border border-border-strong text-foreground/45 hover:border-purple hover:text-purple"><AdminIcon name="view" className="size-4" /></Link><Link href={`/admin/shop/redeem/${item.redeem_item_id}?edit=1`} className="grid size-9 place-items-center rounded-xl border border-border-strong text-orange hover:border-orange"><AdminIcon name="edit" className="size-4" /></Link></div></td>
          </tr>)}
          {!safeItems.length ? <tr><td colSpan={10}><AdminEmptyState title="Item redeem belum tersedia" description="Tambahkan voucher atau kuota pertama untuk membuka katalog redeem." /></td></tr> : null}
        </tbody>
      </table>
    </AdminTableShell>
  );
}
