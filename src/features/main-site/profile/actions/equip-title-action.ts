"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { serverApi } from "@/src/shared/services/api/server-api";

export async function equipTitleAction(titleId: string) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) return { success: false as const, message: "Sesi pengguna sudah berakhir." };

  try {
    await serverApi(`/users/titles/${encodeURIComponent(titleId)}/equip`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    revalidatePath("/profile");
    revalidatePath("/lobby");
    return { success: true as const };
  } catch (error) {
    return { success: false as const, message: error instanceof Error ? error.message : "Gelar gagal dipakai." };
  }
}
