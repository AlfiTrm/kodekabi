import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { UserCompetencyPanel } from "../components/user-competency-panel";
import { UserDetailSummary } from "../components/user-detail-summary";
import { UserManagementPanel } from "../components/user-management-panel";
import { UserRecentProgress } from "../components/user-recent-progress";
import { getAdminUserDetail, resolveAdminUserId } from "../services/admin-users-service";
import type { AdminUserDetailResponse } from "../types/admin-user";

export async function AdminUserDetailPage({ username }: { username: string }) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let detail: AdminUserDetailResponse | null = null;

  try {
    const userId = await resolveAdminUserId(username, accessToken);
    if (!userId) notFound();
    detail = await getAdminUserDetail(userId, accessToken);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
  }

  if (!detail) {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <AdminPageHeader title="Detail User" description="Informasi perkembangan dan performa pengguna" />
        <section className="mt-6 rounded-2xl border border-red/25 bg-red/8"><AdminEmptyState title="Detail gagal dimuat" description="Periksa koneksi API atau sesi admin, lalu muat ulang halaman." /></section>
      </div>
    );
  }

  const { user, recent_progress: recentProgress } = detail;
  const metrics = [
    { label: "Level", value: user.current_level.toLocaleString("id-ID"), note: `${user.current_xp.toLocaleString("id-ID")} XP`, tone: "text-purple" },
    { label: "XP saat ini", value: user.current_xp.toLocaleString("id-ID"), note: "progres level", tone: "text-blue" },
    { label: "Reputasi", value: user.auditor_reputation.toLocaleString("id-ID"), note: "auditor points", tone: "text-green" },
    { label: "Gelar", value: user.title || "Belum ada", note: user.role_name, tone: "text-orange" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Detail User"
        description="Informasi perkembangan dan performa pengguna"
        breadcrumb={<><Link href="/admin/users" className="transition-colors hover:text-purple">Users</Link><span className="mx-2">›</span><span>{user.username}</span></>}
      />

      <UserDetailSummary user={user} />

      <div className="mt-6 flex gap-8 border-b border-border text-xs">
        <span className="border-b-2 border-purple px-4 pb-3 font-semibold text-foreground">Overview</span>
        <span className="px-4 pb-3 text-foreground/40">Aksi Admin</span>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-border bg-surface p-5">
                <p className="font-mono text-[8px] uppercase text-foreground/40">{metric.label}</p>
                <strong className="mt-3 block truncate font-display text-2xl font-semibold">{metric.value}</strong>
                <p className={`mt-1 font-mono text-[8px] ${metric.tone}`}>{metric.note}</p>
              </article>
            ))}
          </section>
          <UserCompetencyPanel user={user} />
        </div>

        <aside className="space-y-5">
          <UserManagementPanel user={user} />
          <UserRecentProgress items={recentProgress?.items ?? []} />
        </aside>
      </div>
    </div>
  );
}
