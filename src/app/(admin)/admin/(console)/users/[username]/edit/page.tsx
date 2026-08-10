import type { Metadata } from "next";

import { AdminEditUserPage } from "@/src/features/admin/users/containers/admin-edit-user-page";

export const metadata: Metadata = {
  title: "Edit User | KODEKABI Admin",
};

export default async function AdminEditUserRoute({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <AdminEditUserPage username={username} />;
}
