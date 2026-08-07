import { PublicFooter } from "@/src/features/public-site/_shared/components/public-footer";
import { PublicNavbar } from "@/src/features/public-site/_shared/components/public-navbar";

export default function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PublicNavbar />
      <div className="flex flex-1 flex-col pt-32 lg:pt-20">{children}</div>
      <PublicFooter />
    </div>
  );
}
