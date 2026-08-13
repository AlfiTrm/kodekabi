import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminCreateRedeemItemPage } from "@/src/features/admin/shop/containers/admin-create-redeem-item-page";
import { getAdminRedeemTypes } from "@/src/features/admin/shop/services/admin-redeem-items-service";
import type { AdminRedeemType } from "@/src/features/admin/shop/types/admin-redeem-item";

export const metadata: Metadata = { title: "Tambah Item Redeem | KODEKABI Admin" };

export default async function AdminAddRedeemItemRoute() {
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  let types: AdminRedeemType[] = [];
  let typeError = "";
  try { types = await getAdminRedeemTypes(token); }
  catch { typeError = "Daftar tipe redeem gagal dimuat. Periksa koneksi API lalu muat ulang halaman."; }
  if (!typeError && !types.length) typeError = "Belum ada tipe redeem yang tersedia. Tambahkan tipe melalui backend sebelum membuat item.";
  return <AdminCreateRedeemItemPage types={types} typeError={typeError} />;
}
