import type { AdminUserDetail } from "../types/admin-user";

type UserDetailSummaryProps = {
  user: AdminUserDetail;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function UserDetailSummary({ user }: UserDetailSummaryProps) {
  return (
    <section className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
      <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-purple/15 font-display text-xl font-bold text-purple">
        {user.username.slice(0, 2).toUpperCase()}
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Avatar hosts are dynamic backend data.
          <img src={user.avatar_url} alt="" className="absolute inset-0 size-full object-cover" />
        ) : null}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="truncate font-display text-2xl font-semibold uppercase tracking-[-0.025em] sm:text-3xl">{user.username}</h2>
          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[8px] font-bold uppercase text-foreground/50">{user.role_name}</span>
          <span className={`rounded-full px-2.5 py-1 text-[8px] font-bold capitalize ${user.status === "active" ? "bg-green/15 text-green" : "bg-red/15 text-red"}`}>{user.status}</span>
        </div>
        <dl className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-xs text-foreground/45">
          <div className="flex gap-2"><dt>Email:</dt><dd className="font-semibold text-foreground">{user.email}</dd></div>
          <div className="flex gap-2"><dt>Terdaftar:</dt><dd className="font-semibold text-foreground">{formatDate(user.created_at)}</dd></div>
          <div className="flex gap-2"><dt>Diperbarui:</dt><dd className="font-semibold text-foreground">{formatDate(user.updated_at)}</dd></div>
        </dl>
      </div>

      <p className="shrink-0 font-mono text-[9px] text-foreground/30">UID: {user.user_id}</p>
    </section>
  );
}
