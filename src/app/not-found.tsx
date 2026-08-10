import { NotFoundPage } from "@/src/features/system/not-found/components/not-found-page";
import { PageLoader } from "@/src/shared/components/feedback/page-loader/page-loader";

export default function NotFound() {
  return (
    <>
      <PageLoader label="Menelusuri arsip kota" />
      <NotFoundPage />
    </>
  );
}
