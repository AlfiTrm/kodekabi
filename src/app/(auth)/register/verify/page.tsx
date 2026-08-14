import { redirect } from "next/navigation";

import { RegisterVerifyPage } from "@/src/features/auth/register/verify/components/register-verify-page";
import { readRegistrationSession } from "@/src/features/auth/register/_shared/utils/register-session";

export default async function RegisterVerifyRoute() {
  const session = await readRegistrationSession();
  if (!session) redirect("/register");
  return <RegisterVerifyPage email={session.email} verified={session.current_step !== "email_submitted"} />;
}
