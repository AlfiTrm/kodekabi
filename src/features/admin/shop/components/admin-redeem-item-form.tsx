"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { createAdminRedeemItemAction } from "../actions/create-admin-redeem-item-action";
import { updateAdminRedeemItemAction } from "../actions/update-admin-redeem-item-action";
import { claimPeriodOptions } from "../data/redeem-item-options";
import { useAdminRedeemItemForm } from "../hooks/use-admin-redeem-item-form";
import type { AdminRedeemItem, AdminRedeemType } from "../types/admin-redeem-item";
import { ItemImageUpload } from "./item-image-upload";
import { ItemToggle } from "./item-toggle";
import { RedeemTypeCombobox } from "./redeem-type-combobox";

const initialState = { error: null };

export function AdminRedeemItemForm({ types, item, onCancel }: { types: AdminRedeemType[]; item?: AdminRedeemItem; onCancel?: () => void }) {
  const [state, action, pending] = useActionState(item ? updateAdminRedeemItemAction : createAdminRedeemItemAction, initialState);
  const { values, setters, valid } = useAdminRedeemItemForm(item, types[0]?.code, types[0]?.name);
  const inputClass = "h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-xs outline-none transition-colors placeholder:text-foreground/25 focus:border-purple";

  return (
    <form action={action} className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
      {item ? <input type="hidden" name="redeem_item_id" value={item.redeem_item_id} /> : null}
      <input type="hidden" name="type" value={values.submittedTypeCode} />
      <input type="hidden" name="is_stock_visible" value={String(values.stockVisible)} />
      <input type="hidden" name="status" value={values.active ? "active" : "inactive"} />
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="space-y-5">
          <label className="block"><span className="mb-2 block text-xs font-semibold">Nama Item</span><input name="name" value={values.name} onChange={(event) => setters.setName(event.target.value)} className={inputClass} placeholder="Voucher Grab Rp25.000" /></label>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-xs font-semibold">Tipe</span>
              <RedeemTypeCombobox types={types} value={values.customType} onInput={setters.writeType} onSelect={(type) => setters.selectType(type.code, type.name)} />
            </div>
            <label><span className="mb-2 block text-xs font-semibold">Nama Partner</span><input name="partner_name" value={values.partnerName} onChange={(event) => setters.setPartnerName(event.target.value)} className={inputClass} placeholder="Grab" /></label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label><span className="mb-2 block text-xs font-semibold">Harga Koin</span><input type="number" min="0" name="price_coin" value={values.priceCoin} onChange={(event) => setters.setPriceCoin(event.target.value)} className={inputClass} placeholder="5000" /></label>
            <label><span className="mb-2 block text-xs font-semibold">Maks. Klaim per Periode</span><input type="number" min="0" name="max_claim_per_period" value={values.maxClaim} onChange={(event) => setters.setMaxClaim(event.target.value)} className={inputClass} /></label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><span className="mb-2 block text-xs font-semibold">Periode Klaim</span><AdminFilterSelect name="claim_period" label="Periode" showLabel={false} value={values.claimPeriod} onChange={setters.setClaimPeriod} options={[...claimPeriodOptions]} /></div>
            <label><span className="mb-2 block text-xs font-semibold">Level Minimum</span><input type="number" min="0" name="minimum_level" value={values.minimumLevel} onChange={(event) => setters.setMinimumLevel(event.target.value)} className={inputClass} /></label>
          </div>
          <label className="block"><span className="mb-2 block text-xs font-semibold">Deskripsi & Instruksi Klaim</span><textarea name="description" rows={7} value={values.description} onChange={(event) => setters.setDescription(event.target.value)} className="w-full resize-y rounded-xl border border-border-strong bg-background px-4 py-3 text-xs leading-5 outline-none placeholder:text-foreground/25 focus:border-purple" placeholder="Jelaskan manfaat item dan cara klaim." /></label>
        </div>
        <div className="space-y-5">
          <div><span className="mb-2 block text-xs font-semibold">Gambar Item</span><ItemImageUpload initialUrl={item?.image_url} required={!item} /></div>
          <div className="divide-y divide-border rounded-2xl border border-border bg-background px-4">
            <ItemToggle checked={values.active} onChange={setters.setActive} label="Aktifkan Item" description="Item dapat segera diklaim" />
            <ItemToggle checked={values.stockVisible} onChange={setters.setStockVisible} label="Tampilkan Stok" description="Tampilkan stok kepada pemain" />
          </div>
        </div>
      </div>
      {state.error ? <p role="alert" className="mt-6 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}
      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        {onCancel ? <button type="button" onClick={onCancel} className="h-11 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55">Batal</button> : <Link href="/admin/shop?tab=redeem" className="grid h-11 min-w-24 place-items-center rounded-full border border-border-strong px-5 text-xs text-foreground/55">Batal</Link>}
        <button type="submit" disabled={pending || !valid} className="h-11 min-w-36 cursor-pointer rounded-full bg-purple px-6 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-button-ink disabled:cursor-not-allowed disabled:opacity-40">{pending ? "Menyimpan..." : item ? "Simpan Perubahan" : "Simpan Item"}</button>
      </div>
    </form>
  );
}
