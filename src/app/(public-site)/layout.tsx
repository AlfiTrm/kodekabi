import { PublicFooter } from "@/src/features/public-site/_shared/components/public-footer";
import { PublicEntrance } from "@/src/features/public-site/_shared/components/public-entrance";
import { PublicNavbar } from "@/src/features/public-site/_shared/components/public-navbar";
import { PageLoader } from "@/src/shared/components/feedback/page-loader/page-loader";

export default function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicEntrance />
      <PageLoader label="Membuka berkas kota" />
      <div className="flex min-h-full flex-col bg-background">
        <PublicNavbar />
        <div className="flex flex-1 flex-col pt-32 lg:pt-20">{children}</div>
        <PublicFooter />
      </div>
    </>
  );
}
