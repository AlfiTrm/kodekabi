import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { ProfileContent } from "../components/profile-content";
import { getUserProfile } from "../services/user-profile-service";
import { getUserTitles } from "../services/user-titles-service";
import { getUserInventory } from "../services/user-inventory-service";

export async function ProfilePage() {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");
  const [profile, titles, inventory] = await Promise.all([
    getUserProfile(accessToken).catch(() => null),
    getUserTitles(accessToken).catch(() => []),
    getUserInventory(accessToken).catch(() => []),
  ]);
  if (!profile) return <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-background px-5"><div className="max-w-md rounded-3xl border border-red/30 bg-red/5 px-7 py-10 text-center"><h1 className="font-display text-3xl font-semibold text-foreground">Profil gagal dimuat.</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Periksa koneksi atau sesi akunmu, lalu coba muat profil kembali.</p><Link href="/profile" className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-xs font-bold text-background">Muat ulang</Link></div></main>;
  return <ProfileContent data={profile} titles={titles} inventory={inventory} />;
}
