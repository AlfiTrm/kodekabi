"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AdminRole } from "../types/admin-user";

const AdminRolesContext = createContext<AdminRole[]>([]);

export function AdminRolesProvider({ roles, children }: { roles: AdminRole[]; children: ReactNode }) {
  return <AdminRolesContext value={roles}>{children}</AdminRolesContext>;
}

export function useAdminRoles() {
  return useContext(AdminRolesContext);
}
