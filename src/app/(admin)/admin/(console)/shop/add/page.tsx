import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminCreateItemPage } from "@/src/features/admin/shop/containers/admin-create-item-page";
import { getAdminItemCategoriesFromCatalog } from "@/src/features/admin/shop/services/admin-items-service";
import type { AdminItemCategory } from "@/src/features/admin/shop/types/admin-item";

export const metadata: Metadata = { title: "Tambah Item | KODEKABI Admin" };

export default async function AdminAddItemRoute() {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let categories: AdminItemCategory[] = [];
  let categoryError = "";
  try {
    categories = await getAdminItemCategoriesFromCatalog(accessToken);
  } catch {
    categoryError = "Kategori tidak dapat diturunkan dari daftar item. Periksa koneksi API lalu muat ulang halaman.";
  }

  if (!categoryError && !categories.length) {
    categoryError = "Belum ada kategori yang melekat pada item katalog. Backend perlu menyediakan endpoint lookup kategori agar item pertama dapat dibuat.";
  }
  return <AdminCreateItemPage categories={categories} categoryError={categoryError} />;
}
