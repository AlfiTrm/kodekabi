import { redirect } from "next/navigation";

import { readRegistrationSession } from "@/src/features/auth/register/_shared/utils/register-session";
import { getRegistrationAvatars } from "@/src/features/auth/register/_shared/services/register-auth-service";
import { findDetectiveIdByAvatar } from "@/src/features/auth/register/detective/utils/registration-avatars";
import { RegisterProfilePage } from "@/src/features/auth/register/profile/components/register-profile-page";

export default async function RegisterProfileRoute() {
  const session = await readRegistrationSession();
  if (!session) redirect("/register");
  if (session.current_step === "email_submitted") redirect("/register/verify");
  if (session.current_step === "email_verified") redirect("/register/detective");

  const avatars = await getRegistrationAvatars();
  return <RegisterProfilePage initialDetectiveId={findDetectiveIdByAvatar(avatars, session.avatar_id)} />;
}
