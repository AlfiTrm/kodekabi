"use client";

import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { AdminSearchField } from "../../_shared/components/admin-search-field";
import { useAdminDirectoryQuery } from "../../_shared/hooks/use-admin-directory-query";
import { useAdminRoles } from "../context/admin-roles-context";

type UserFiltersProps = {
  search: string;
  role: string;
  status: string;
};

const statusOptions = [
  { value: "all", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
];

function roleLabel(roleName: string) {
  return roleName.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function UserFilters({ search, role, status }: UserFiltersProps) {
  const roles = useAdminRoles();
  const { isPending, searchValue, setSearchValue, updateQuery } = useAdminDirectoryQuery({ search });
  const roleOptions = [
    { value: "all", label: "Semua" },
    ...roles.map((item) => ({ value: item.role_name, label: roleLabel(item.role_name) })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-busy={isPending}>
      <AdminSearchField value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Cari username atau email..." pending={isPending} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <AdminFilterSelect name="role" label="Role" value={role} options={roleOptions} onChange={(value) => updateQuery({ role: value })} disabled={isPending} />
        <AdminFilterSelect name="status" label="Status" value={status} options={statusOptions} onChange={(value) => updateQuery({ status: value })} disabled={isPending} />
      </div>
    </div>
  );
}
