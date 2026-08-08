import { MainNavbar } from "@/src/features/main-site/_shared/components/main-navbar";
import { PageLoader } from "@/src/shared/components/feedback/page-loader/page-loader";

export default function MainSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PageLoader label="Menuju Kota Nusa" />
      <MainNavbar />
      {children}
    </div>
  );
}
