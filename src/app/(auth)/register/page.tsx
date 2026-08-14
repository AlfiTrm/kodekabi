import { redirect } from "next/navigation";

import { RegisterAccountPage } from "@/src/features/auth/register/account/components/register-account-page";
import { readRegistrationSession } from "@/src/features/auth/register/_shared/utils/register-session";
import { registrationStepRoute } from "@/src/features/auth/register/_shared/utils/register-routes";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ review?: string }> }) {
  const { review } = await searchParams;
  const session = await readRegistrationSession();
  if (session && review !== "account") redirect(registrationStepRoute(session.current_step));
  return <RegisterAccountPage />;
}
