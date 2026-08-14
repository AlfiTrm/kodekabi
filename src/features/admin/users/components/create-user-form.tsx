"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { AuthInput } from "@/src/features/auth/_shared/components/auth-input";
import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { createAdminUserAction } from "../actions/create-admin-user-action";
import type { AdminRole } from "../types/admin-user";

const initialState = { error: null };

function roleLabel(roleName: string) {
  return roleName.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function CreateUserForm({ roles }: { roles: AdminRole[] }) {
  const [state, formAction, pending] = useActionState(createAdminUserAction, initialState);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const roleOptions = roles.map((role) => ({ value: role.role_name, label: roleLabel(role.role_name) }));
  const canSubmit = Boolean(email.trim() && username.trim() && password.length >= 8 && confirmation && roleOptions.length > 0);

  return (
    <form action={formAction} className="mt-6 rounded-2xl border border-border bg-surface p-5 sm:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        <AuthInput label="Email *" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="contoh@mail.com" autoComplete="off" required disabled={pending} invalid={Boolean(state.error)} />
        <AuthInput label="Username *" name="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="alya_putri" autoComplete="off" maxLength={32} required disabled={pending} invalid={Boolean(state.error)} />
        <AuthInput label="Password *" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" autoComplete="new-password" required disabled={pending} invalid={Boolean(state.error)} />
        <AuthInput label="Konfirmasi Password *" name="password_confirmation" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Ulangi password" autoComplete="new-password" required disabled={pending} invalid={Boolean(state.error)} />
        <div>
          <span className="mb-2 block text-xs font-semibold">Role Utama *</span>
          {roleOptions.length > 0 ? <AdminFilterSelect name="role_name" label="Role" value={roleOptions[0].value} options={roleOptions} disabled={pending} /> : <p className="flex h-11 items-center rounded-xl border border-red/30 bg-red/8 px-4 text-xs text-red">Role gagal dimuat.</p>}
        </div>
        <div>
          <span className="mb-2 block text-xs font-semibold">Status *</span>
          <AdminFilterSelect name="status" label="Status" value="active" options={[{ value: "active", label: "Aktif" }, { value: "suspended", label: "Suspended" }]} disabled={pending} />
        </div>
      </div>

      {state.error ? <p role="alert" className="mt-5 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Link href="/admin/users" className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground">Batal</Link>
        <button type="submit" disabled={!canSubmit || pending} className="h-10 min-w-36 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">
          {pending ? "Menyimpan..." : "Simpan User"}
        </button>
      </div>
    </form>
  );
}
