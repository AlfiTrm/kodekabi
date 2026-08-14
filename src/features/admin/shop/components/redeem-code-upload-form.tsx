"use client";

import Link from "next/link";
import { useRef } from "react";
import { AdminDateInput } from "../../_shared/components/admin-date-input";
import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import type { AdminRedeemItem } from "../types/admin-redeem-item";
import { useRedeemCodeUploadForm } from "../hooks/use-redeem-code-upload-form";

export function RedeemCodeUploadForm({ items }: { items: AdminRedeemItem[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useRedeemCodeUploadForm();
  const itemOptions = [{ value: "", label: "Pilih item redeem" }, ...items.map((item) => ({ value: item.redeem_item_id, label: item.name }))];

  return (
    <div className="mt-7 rounded-3xl border border-border bg-surface p-5 sm:p-7">
      <form action={form.uploadAction}>
        <div><h2 className="font-display text-xl font-semibold">Upload batch CSV</h2><p className="mt-1 text-xs leading-5 text-foreground/45">Gunakan CSV untuk memasukkan banyak kode sekaligus. Item dan tanggal kedaluwarsa dibaca dari setiap baris file.</p></div>
        <input ref={fileInputRef} name="file" type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => form.setFile(event.target.files?.[0] ?? null)} />
        <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const nextFile = event.dataTransfer.files[0]; if (nextFile) form.setFile(nextFile); }} className="mt-6 grid min-h-48 w-full cursor-pointer place-items-center rounded-2xl border border-dashed border-purple bg-background p-6 text-center transition-colors hover:bg-purple/5">
          <span><svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto size-8 fill-none stroke-current text-purple" strokeWidth="1.5"><path d="M7 3h7l4 4v14H7zM14 3v5h5M9 15h6m-3-3v6" /></svg><strong className="mt-3 block text-sm">{form.file ? form.file.name : "Seret atau pilih file CSV"}</strong><small className="mt-1 block text-[10px] text-foreground/35">CSV maksimal 2MB</small></span>
        </button>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background p-4 text-[10px]"><span className={form.file ? "text-green" : "text-foreground/40"}>{form.file ? `${form.file.name} siap diunggah` : "Belum ada file dipilih"}</span><a href="/templates/redeem-codes-template.csv" download className="font-semibold text-purple underline-offset-4 hover:underline">Download Template CSV</a></div>
        {form.uploadState.error ? <p className="mt-4 rounded-xl border border-red/30 bg-red/10 p-3 text-xs text-red">{form.uploadState.error}</p> : null}
        <button type="submit" disabled={!form.file || form.uploadPending} className="mt-5 h-11 w-full cursor-pointer rounded-full bg-purple text-xs font-semibold text-white transition-colors hover:bg-purple/80 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">{form.uploadPending ? "Mengunggah..." : "Upload Batch CSV"}</button>
      </form>

      <div className="my-7 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-border" /><span className="rounded-full border border-border px-3 py-1 text-[9px] uppercase text-foreground/40">atau</span><span className="h-px flex-1 bg-border" /></div>

      <form action={form.manualAction}>
        <div><h2 className="font-display text-xl font-semibold">Tambah kode manual</h2><p className="mt-1 text-xs leading-5 text-foreground/45">Tambahkan satu kode unik untuk item redeem tertentu.</p></div>
        <div className="mt-6 space-y-5">
          <label className="block text-xs font-semibold"><span>Item redeem</span><div className="mt-2"><AdminFilterSelect name="redeem_item_id" label="Item" value={form.redeemItemId} options={itemOptions} onChange={form.setRedeemItemId} showLabel={false} disabled={!items.length} /></div></label>
          <label className="block text-xs font-semibold"><span>Kode redeem</span><input name="code" required autoComplete="off" placeholder="KDB-NEON-ABCD-9281" className="mt-2 h-11 w-full rounded-xl border border-border-strong bg-background px-4 font-mono text-xs uppercase outline-none transition-colors placeholder:text-foreground/25 focus:border-purple" /></label>
          <AdminDateInput name="expires_at" label="Tanggal kedaluwarsa" value={form.expiresAt} onValueChange={form.setExpiresAt} required min={new Date().toISOString().slice(0, 10)} />
        </div>
        {!items.length ? <p className="mt-4 rounded-xl border border-orange/30 bg-orange/10 p-3 text-xs text-orange">Belum ada item redeem. Buat item redeem sebelum menambahkan kode manual.</p> : null}
        {form.manualState.error ? <p className="mt-4 rounded-xl border border-red/30 bg-red/10 p-3 text-xs text-red">{form.manualState.error}</p> : null}
        <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5"><Link href="/admin/shop?tab=codes" className="grid h-11 place-items-center rounded-full border border-border-strong px-6 text-xs font-semibold">Batal</Link><button type="submit" disabled={!items.length || !form.redeemItemId || !form.expiresAt || form.manualPending} className="h-11 cursor-pointer rounded-full bg-white px-7 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">{form.manualPending ? "Menyimpan..." : "Simpan Kode Manual"}</button></div>
      </form>
    </div>
  );
}
