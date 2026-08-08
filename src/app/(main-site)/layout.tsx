export default function MainSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <PageLoader label="Menuju Kota Nusa" />
      {children}
    </div>
  );
}
import { PageLoader } from "@/src/shared/components/feedback/page-loader/page-loader";
