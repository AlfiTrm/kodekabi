"use client";

import { useActionState } from "react";
import Link from "next/link";

import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { createAdminTitleAction } from "../actions/create-admin-title-action";
import { updateAdminTitleAction } from "../actions/update-admin-title-action";
import { titleStatusOptions } from "../data/title-options";
import { useAdminTitleForm } from "../hooks/use-admin-title-form";
import type { AdminTitle } from "../types/admin-title";
import { TitleImageUpload } from "./title-image-upload";

type AdminTitleFormProps = {
  title?: AdminTitle;
  onCancel?: () => void;
};

const initialState = { error: null };

export function AdminTitleForm({ title, onCancel }: AdminTitleFormProps) {
  const action = title ? updateAdminTitleAction : createAdminTitleAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const { values, setters, valid } = useAdminTitleForm(title);

  return (
    <form action={formAction} className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
      {title ? <input type="hidden" name="title_id" value={title.title_id} /> : null}

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Nama Title</span>
            <input name="title" value={values.name} onChange={(event) => setters.setName(event.target.value)} maxLength={100} placeholder="Contoh: Detektif Super Senior" className="h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-xs outline-none transition-colors placeholder:text-foreground/25 focus:border-purple" />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold">Unlock Level</span>
              <input name="unlock_level" type="number" min="0" step="1" value={values.unlockLevel} onChange={(event) => setters.setUnlockLevel(event.target.value)} placeholder="Contoh: 3" className="h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-xs outline-none transition-colors placeholder:text-foreground/25 focus:border-purple" />
            </label>
            <div>
              <span className="mb-2 block text-xs font-semibold">Status</span>
              <AdminFilterSelect name="status" label="Status" showLabel={false} value={values.status} options={[...titleStatusOptions]} onChange={setters.setStatus} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <span className="mb-2 block text-xs font-semibold">Gambar Title</span>
            <TitleImageUpload initialUrl={title?.image_border ?? ""} required={!title} />
          </div>
        </div>
      </div>

      {state.error ? <p role="alert" className="mt-6 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button type="button" disabled={pending} onClick={onCancel} className="h-11 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground disabled:cursor-not-allowed">Batal</button>
        ) : (
          <Link href="/admin/titles" className="grid h-11 min-w-24 place-items-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground">Batal</Link>
        )}
        <button type="submit" disabled={pending || !valid} className="h-11 min-w-36 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{pending ? "Menyimpan..." : title ? "Simpan Perubahan" : "Simpan Title"}</button>
      </div>
    </form>
  );
}
