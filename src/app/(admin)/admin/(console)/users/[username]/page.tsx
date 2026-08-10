import type { Metadata } from "next";

import { AdminUserDetailPage } from "@/src/features/admin/users/containers/admin-user-detail-page";

export const metadata: Metadata = {
  title: "Detail User | KODEKABI Admin",
};

type AdminUserDetailRouteProps = {
  params: Promise<{ username: string }>;
};

export default async function AdminUserDetailRoute({ params }: AdminUserDetailRouteProps) {
  const { username } = await params;
  return <AdminUserDetailPage username={username} />;
}
