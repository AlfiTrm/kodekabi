import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { isUserAccessToken } from "@/src/features/auth/login/utils/user-token";
import { MainNavbar } from "@/src/features/main-site/_shared/components/main-navbar";
import { PageLoader } from "@/src/shared/components/feedback/page-loader/page-loader";

export default async function MainSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!token || !isUserAccessToken(token)) redirect("/login");

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PageLoader label="Menuju Kota Nusa" />
      <MainNavbar />
      {children}
    </div>
  );
}
