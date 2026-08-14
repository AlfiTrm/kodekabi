import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import type { AdminRedeemCode, AdminRedeemCodesPagination } from "../types/admin-redeem-code";
import { DeleteRedeemCodeButton } from "./delete-redeem-code-button";

const number = new Intl.NumberFormat("id-ID");
const date = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" });

function formatDate(value: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "-" : date.format(parsed);
}

const statusClasses: Record<string, string> = {
  available: "bg-green/12 text-green",
  claimed: "bg-purple/12 text-purple",
  expired: "bg-red/12 text-red",
};

export function RedeemCodesTable({ redeemCodes, pagination }: { redeemCodes: AdminRedeemCode[]; pagination: AdminRedeemCodesPagination }) {
  const safeCodes = Array.isArray(redeemCodes) ? redeemCodes : [];
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <AdminTableShell footer={<><p className="text-[10px] text-foreground/40">Menampilkan {start}-{end} dari {number.format(pagination.total)} kode redeem</p><AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={(page) => `/admin/shop?tab=codes&page=${page}`} previousLabel="Sebelumnya" nextLabel="Selanjutnya" /></>}>
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead className="border-b border-border text-[9px] uppercase text-foreground/45"><tr><th className="px-5 py-4 font-medium">Kode Redeem</th><th className="px-4 py-4 font-medium">Item Terkait</th><th className="px-4 py-4 font-medium">Status</th><th className="px-4 py-4 font-medium">Diklaim Oleh</th><th className="px-4 py-4 font-medium">Tanggal Klaim</th><th className="px-4 py-4 font-medium">Expired Date</th><th className="sticky right-0 bg-surface px-5 py-4 text-right font-medium">Aksi</th></tr></thead>
        <tbody className="divide-y divide-border">
          {safeCodes.map((item) => (
            <tr key={item.redeem_code_id} className="group transition-colors hover:bg-white/[0.025]">
              <td className="px-5 py-3 font-mono text-[10px] font-semibold text-orange">{item.code}</td>
              <td className="px-4 py-3 text-xs font-semibold">{item.redeem_item_name || "-"}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase ${statusClasses[item.status] ?? "bg-surface-muted text-foreground/45"}`}>{item.status}</span></td>
              <td className="px-4 py-3 text-[10px] text-foreground/55">{item.claimed_by || "-"}</td>
              <td className="px-4 py-3 text-[10px] text-foreground/55">{formatDate(item.claimed_at)}</td>
              <td className={`px-4 py-3 text-[10px] ${item.status === "expired" ? "text-red" : "text-foreground/55"}`}>{formatDate(item.expires_at)}</td>
              <td className="sticky right-0 bg-surface px-5 py-3 group-hover:bg-surface-elevated"><div className="flex justify-end"><DeleteRedeemCodeButton redeemCodeId={item.redeem_code_id} code={item.code} /></div></td>
            </tr>
          ))}
          {!safeCodes.length ? <tr><td colSpan={7}><AdminEmptyState title="Kode redeem belum tersedia" description="Unggah batch CSV atau tambahkan satu kode manual untuk memulai inventaris redeem." /></td></tr> : null}
        </tbody>
      </table>
    </AdminTableShell>
  );
}
