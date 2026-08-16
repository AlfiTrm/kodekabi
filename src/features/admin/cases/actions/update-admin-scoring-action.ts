"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { updateAdminCaseScoringOutcomeConfig } from "../services/admin-cases-service";

export type UpdateScoringActionState = {
  error: string | null;
  success?: string | null;
};

export async function updateAdminScoringAction(
  caseId: string,
  versionId: string,
  slug: string,
  _prevState: UpdateScoringActionState,
  formData: FormData,
): Promise<UpdateScoringActionState> {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return { error: "Sesi admin sudah berakhir." };

  try {
    const rawData = formData.get("config_json");
    if (!rawData || typeof rawData !== "string") {
      throw new Error("Invalid configuration data");
    }

    const payload = JSON.parse(rawData);

    await updateAdminCaseScoringOutcomeConfig(caseId, versionId, payload, accessToken);

    revalidatePath(`/admin/cases/${slug}`);
    
    return { error: null, success: "Konfigurasi scoring berhasil disimpan." };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : "Gagal menyimpan konfigurasi scoring.",
      success: null
    };
  }
}
