import { redirect } from "next/navigation";

import { readRegistrationSession } from "@/src/features/auth/register/_shared/utils/register-session";
import { getRegistrationAvatars } from "@/src/features/auth/register/_shared/services/register-auth-service";
import { RegisterDetectivePage } from "@/src/features/auth/register/detective/components/register-detective-page";
import { findDetectiveIdByAvatar, mapRegistrationAvatarIds } from "@/src/features/auth/register/detective/utils/registration-avatars";

export default async function RegisterDetectiveRoute() {
  const session = await readRegistrationSession();
  if (!session) redirect("/register");
  if (session.current_step === "email_submitted") redirect("/register/verify");

  const avatars = await getRegistrationAvatars();
  const avatarIds = mapRegistrationAvatarIds(avatars);
  return <RegisterDetectivePage avatarIds={avatarIds} initialDetectiveId={findDetectiveIdByAvatar(avatars, session.avatar_id)} completed={session.current_step === "avatar_selected"} />;
}
