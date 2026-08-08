import { PublicFooter } from "@/src/features/public-site/_shared/components/public-footer";
import { PublicEntrance } from "@/src/features/public-site/_shared/components/public-entrance";
import { PublicNavbar } from "@/src/features/public-site/_shared/components/public-navbar";
import { PUBLIC_ENTRANCE_STORAGE_KEY } from "@/src/features/public-site/_shared/constants/entrance";
import { PageLoader } from "@/src/shared/components/feedback/page-loader/page-loader";

const entranceBootstrap = `try{document.documentElement.dataset.kodekabiEntrance=localStorage.getItem('${PUBLIC_ENTRANCE_STORAGE_KEY}')==='true'?'seen':'new'}catch{document.documentElement.dataset.kodekabiEntrance='new'}`;

export default function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: entranceBootstrap }} />
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
