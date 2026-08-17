import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import type { AdminTitle } from "../types/admin-title";
import { TitleDetailActions } from "../components/title-detail-actions";

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export function AdminTitleDetailPage({ title, edit }: { title: AdminTitle; edit: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Detail Title" description="Spesifikasi dan pengaturan publikasi title." breadcrumb={<><Link href="/admin/titles" className="hover:text-purple">Titles</Link><span className="mx-2">›</span>{title.title}</>} />

      <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <article className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="grid aspect-square w-full shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-background sm:w-52">
              {title.image_border ? (
                // eslint-disable-next-line @next/next/no-img-element -- Title hosts are dynamic backend data.
                <img src={title.image_border} alt={title.title} className="size-full object-contain p-4" />
              ) : <span className="text-sm text-foreground/25">Tanpa gambar</span>}
            </div>
            <div className="min-w-0 flex-1">
              <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase ${title.status === "active" ? "bg-green/12 text-green" : "bg-red/12 text-red"}`}>{title.status}</span>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em]">{title.title}</h2>
              <div className="mt-6">
                <p className="text-[9px] uppercase tracking-wider text-foreground/35">Unlock level</p>
                <strong className="mt-1 block font-mono text-2xl text-orange">LV {title.unlock_level}</strong>
              </div>
            </div>
          </div>
        </article>

        <aside className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
          <h2 className="font-display text-xl font-semibold">Status katalog</h2>
          <dl className="mt-5 divide-y divide-border text-xs">
            <div className="flex items-center justify-between py-3"><dt className="text-foreground/45">Status</dt><dd className={title.status === "active" ? "text-green" : "text-red"}>{title.status}</dd></div>
            <div className="flex items-center justify-between py-3"><dt className="text-foreground/45">Unlock level</dt><dd className="font-mono text-[10px]">LV {title.unlock_level}</dd></div>
            <div className="flex items-start justify-between gap-4 py-3"><dt className="text-foreground/45">Dibuat</dt><dd className="text-right text-[10px]">{dateTimeFormatter.format(new Date(title.created_at))}</dd></div>
            <div className="flex items-start justify-between gap-4 py-3"><dt className="text-foreground/45">Diperbarui</dt><dd className="text-right text-[10px]">{dateTimeFormatter.format(new Date(title.updated_at))}</dd></div>
          </dl>
        </aside>
      </section>
      <div className="mt-5">
        <TitleDetailActions title={title} initiallyEditing={edit} />
      </div>
    </div>
  );
}
