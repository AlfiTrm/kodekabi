"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { USER_ACCESS_COOKIE } from "../constants/user-auth";

export async function userLogoutAction() {
  (await cookies()).set(USER_ACCESS_COOKIE, "", { maxAge: 0, path: "/" });
  redirect("/");
}
