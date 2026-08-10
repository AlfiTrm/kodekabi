"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { AuthInput } from "@/src/features/auth/_shared/components/auth-input";
import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { updateAdminUserAction } from "../actions/update-admin-user-action";
import type { AdminRole, AdminUserDetail } from "../types/admin-user";

const initialState = { error: null };

function roleLabel(roleName: string) {
  return roleName.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function EditUserForm({ user, roles }: { user: AdminUserDetail; roles: AdminRole[] }) {
  const [state, formAction, pending] = useActionState(updateAdminUserAction, initialState);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const roleOptions = roles.map((role) => ({ value: role.role_name, label: roleLabel(role.role_name) }));
  const passwordValid = !password || (password.length >= 8 && password === confirmation);
  const canSubmit = Boolean(email.trim() && username.trim() && passwordValid && roleOptions.length > 0);

  return (
    <form action={formAction} className="mt-6 rounded-2xl border border-border bg-surface p-5 sm:p-7">
      <input type="hidden" name="user_id" value={user.user_id} />
      <input type="hidden" name="previous_username" value={user.username} />
      <div className="grid gap-5 md:grid-cols-2">
        <AuthInput label="Email *" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="off" required disabled={pending} invalid={Boolean(state.error)} />
        <AuthInput label="Username *" name="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="off" maxLength={32} required disabled={pending} invalid={Boolean(state.error)} />
        <AuthInput label="Ubah Password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} hint="Kosongkan jika tidak ingin mengubah password." autoComplete="new-password" disabled={pending} invalid={Boolean(state.error)} />
        <AuthInput label="Konfirmasi Ubah Password" name="password_confirmation" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" disabled={pending} invalid={Boolean(state.error)} />
        <div>
          <span className="mb-2 block text-xs font-semibold">Role Utama</span>
          <AdminFilterSelect name="role_name" label="Role" value={user.role_name} options={roleOptions} disabled={pending} />
        </div>
        <div>
          <span className="mb-2 block text-xs font-semibold">Status</span>
          <AdminFilterSelect name="status" label="Status" value={user.status} options={[{ value: "active", label: "Aktif" }, { value: "suspended", label: "Suspended" }, { value: "banned", label: "Banned" }]} disabled={pending} />
        </div>
      </div>

      {state.error ? <p role="alert" className="mt-5 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Link href={`/admin/users/${encodeURIComponent(user.username)}`} className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground">Batal</Link>
        <button type="submit" disabled={!canSubmit || pending} className="h-10 min-w-36 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">
          {pending ? "Menyimpan..." : "Update User"}
        </button>
      </div>
    </form>
  );
}
