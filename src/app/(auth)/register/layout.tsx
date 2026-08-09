import type { ReactNode } from "react";

import { RegisterSessionProvider } from "@/src/features/auth/register/_shared/register-session-context";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <RegisterSessionProvider>{children}</RegisterSessionProvider>;
}
