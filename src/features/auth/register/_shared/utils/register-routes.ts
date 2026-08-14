import type { RegistrationStep } from "../types/register-auth";

export function registrationStepRoute(step: RegistrationStep) {
  switch (step) {
    case "email_submitted": return "/register/verify";
    case "email_verified": return "/register/detective";
    case "avatar_selected": return "/register/profile";
  }
}
