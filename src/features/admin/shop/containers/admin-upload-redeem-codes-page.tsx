import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { RedeemCodeUploadForm } from "../components/redeem-code-upload-form";
import { getAdminRedeemItems } from "../services/admin-redeem-items-service";

export async function AdminUploadRedeemCodesPage() {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let items = [] as Awaited<ReturnType<typeof getAdminRedeemItems>>["items"];
  try {
    items = (await getAdminRedeemItems({ page: 1, limit: 100 }, accessToken)).items;
  } catch {
    items = [];
  }

  return <div className="mx-auto w-full max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><AdminPageHeader title="Upload Batch" description="Unggah ratusan kode redeem unik sekaligus atau tambahkan satu kode manual." /><RedeemCodeUploadForm items={items} /></div>;
}
