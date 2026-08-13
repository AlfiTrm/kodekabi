"use client";

import { useActionState } from "react";
import Link from "next/link";

import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { createAdminItemAction } from "../actions/create-admin-item-action";
import { updateAdminItemAction } from "../actions/update-admin-item-action";
import { itemStatusOptions } from "../data/item-options";
import { useAdminItemForm } from "../hooks/use-admin-item-form";
import type { AdminItem, AdminItemCategory } from "../types/admin-item";
import { ItemImageUpload } from "./item-image-upload";
import { ItemToggle } from "./item-toggle";

type AdminItemFormProps = {
  categories: AdminItemCategory[];
  item?: AdminItem;
  onCancel?: () => void;
};

const initialState = { error: null };

export function AdminItemForm({ categories, item, onCancel }: AdminItemFormProps) {
  const action = item ? updateAdminItemAction : createAdminItemAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const { values, setters, valid } = useAdminItemForm(item, categories[0]?.item_category_id);
  const categoryOptions = categories.map((category) => ({ value: category.item_category_id, label: category.name }));

  return (
    <form action={formAction} className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
      {item ? <input type="hidden" name="item_id" value={item.item_id} /> : null}
      <input type="hidden" name="is_visible" value={String(values.isVisible)} />
      <input type="hidden" name="is_featured" value={String(values.isFeatured)} />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Nama Item</span>
            <input name="name" value={values.name} onChange={(event) => setters.setName(event.target.value)} maxLength={100} placeholder="Contoh: Jaket Nettrunner Special Edition" className="h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-xs outline-none transition-colors placeholder:text-foreground/25 focus:border-purple" />
          </label>

          <div>
            <span className="mb-2 block text-xs font-semibold">Kategori</span>
            <AdminFilterSelect name="item_category_id" label="Kategori" showLabel={false} value={values.categoryId} options={categoryOptions.length ? categoryOptions : [{ value: "", label: "Kategori belum tersedia" }]} onChange={setters.setCategoryId} disabled={!categoryOptions.length} />
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Deskripsi Item</span>
            <textarea name="description" value={values.description} onChange={(event) => setters.setDescription(event.target.value)} rows={5} placeholder="Tulis deskripsi item di sini..." className="w-full resize-y rounded-xl border border-border-strong bg-background px-4 py-3 text-xs leading-5 outline-none transition-colors placeholder:text-foreground/25 focus:border-purple" />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold">Harga Koin</span>
              <input name="price_coin" type="number" min="0" step="1" value={values.priceCoin} onChange={(event) => setters.setPriceCoin(event.target.value)} placeholder="Contoh: 1500" className="h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-xs outline-none transition-colors placeholder:text-foreground/25 focus:border-purple" />
            </label>
            <div>
              <span className="mb-2 block text-xs font-semibold">Status</span>
              <AdminFilterSelect name="status" label="Status" showLabel={false} value={values.status} options={[...itemStatusOptions]} onChange={setters.setStatus} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <span className="mb-2 block text-xs font-semibold">Gambar Item</span>
            <ItemImageUpload initialUrl={item?.image_url} required={!item} />
          </div>
          <div className="divide-y divide-border rounded-2xl border border-border bg-background px-4">
            <ItemToggle checked={values.isVisible} onChange={setters.setIsVisible} label="Tampilkan di Toko" description="Item dapat dilihat dan ditukar pemain" />
            <ItemToggle checked={values.isFeatured} onChange={setters.setIsFeatured} label="Item Unggulan" description="Tampilkan item pada area prioritas katalog" />
          </div>
        </div>
      </div>

      {state.error ? <p role="alert" className="mt-6 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button type="button" disabled={pending} onClick={onCancel} className="h-11 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground disabled:cursor-not-allowed">Batal</button>
        ) : (
          <Link href="/admin/shop" className="grid h-11 min-w-24 place-items-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground">Batal</Link>
        )}
        <button type="submit" disabled={pending || !valid || !categoryOptions.length} className="h-11 min-w-36 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{pending ? "Menyimpan..." : item ? "Simpan Perubahan" : "Simpan Item"}</button>
      </div>
    </form>
  );
}
