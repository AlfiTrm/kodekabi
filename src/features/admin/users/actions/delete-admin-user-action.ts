"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { deleteAdminUser } from "../services/admin-users-service";
import type { DeleteAdminUserActionState } from "../types/admin-user";

export async function deleteAdminUserAction(_state: DeleteAdminUserActionState, formData: FormData): Promise<DeleteAdminUserActionState> {
  const userId = String(formData.get("user_id") ?? "");
  if (!userId) return { error: "ID user tidak ditemukan." };

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  try {
    await deleteAdminUser(userId, accessToken);
    revalidatePath("/admin/users");
    redirect("/admin/users");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    if (error instanceof ApiError) {
      if (error.status === 404) return { error: "User sudah tidak ditemukan." };
      if (error.status === 409) return { error: "User tidak dapat dihapus karena masih memiliki data terkait." };
      return { error: error.message };
    }
    return { error: "User gagal dihapus. Coba lagi." };
  }
}
