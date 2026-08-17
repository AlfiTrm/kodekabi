"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { serverApi } from "@/src/shared/services/api/server-api";

export async function updateNicknameAction(nickname: string) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) return { success: false as const, message: "Sesi pengguna sudah berakhir." };
  if (nickname.trim().length < 3) return { success: false as const, message: "Nickname minimal 3 karakter." };

  try {
    const data = await serverApi<{ nickname: string }, { nickname: string }>("/users/nickname", {
      method: "PATCH",
      body: { nickname: nickname.trim() },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    revalidatePath("/profile");
    revalidatePath("/lobby");
    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, message: error instanceof Error ? error.message : "Nickname gagal diperbarui." };
  }
}
