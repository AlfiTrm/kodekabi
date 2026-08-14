"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { serverApi } from "@/src/shared/services/api/server-api";

import type { EquipShopItemMutationResponse } from "../types/shop";

export async function equipShopItemAction(itemId: string) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) return { success: false as const, message: "Sesi pengguna sudah berakhir." };

  try {
    const data = await serverApi<EquipShopItemMutationResponse>(`/users/shop/items/${encodeURIComponent(itemId)}/equip`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/shop");
    revalidatePath(`/shop/${encodeURIComponent(itemId)}`);
    revalidatePath("/lobby");
    revalidatePath("/profile");
    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, message: error instanceof Error ? error.message : "Item gagal dipakai." };
  }
}
