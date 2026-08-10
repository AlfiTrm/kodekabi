import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import type { AdminRecentProgressItem } from "../types/admin-user";

export function UserRecentProgress({ items }: { items: AdminRecentProgressItem[] }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold uppercase tracking-[-0.02em]">Aktivitas terkini.</h2>
      {items.length === 0 ? (
        <AdminEmptyState title="Belum ada aktivitas" description="Pengguna ini belum memiliki progres kasus yang tercatat." />
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item, index) => (
            <li key={item.case_id ?? `${item.case_title}-${index}`} className="flex items-center gap-3 py-4">
              <span className="size-2 shrink-0 rounded-full bg-green" />
              <div className="min-w-0 flex-1"><strong className="block truncate text-xs">{item.case_title ?? item.title ?? "Aktivitas kasus"}</strong><span className="mt-1 block text-[9px] text-foreground/35">{item.result ?? item.status ?? "Progres diperbarui"}</span></div>
              {item.status ? <span className="font-mono text-[8px] uppercase text-green">{item.status}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
