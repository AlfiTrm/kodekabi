import type { Metadata } from "next";
import { AdminUploadRedeemCodesPage } from "@/src/features/admin/shop/containers/admin-upload-redeem-codes-page";

export const metadata: Metadata = { title: "Upload Kode Redeem | KODEKABI Admin" };

export default function AdminUploadRedeemCodesRoute() {
  return <AdminUploadRedeemCodesPage />;
}
