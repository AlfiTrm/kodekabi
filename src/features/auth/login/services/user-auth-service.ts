import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { UserLoginRequest, UserLoginResponse } from "../types/user-login";

export function loginUser(credentials: UserLoginRequest) {
  return serverApi<UserLoginResponse, UserLoginRequest>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}
