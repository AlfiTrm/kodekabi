export type AdminQueryUpdate = Record<string, string | number | null | undefined>;

type BuildAdminQueryHrefOptions = {
  resetPage?: boolean;
};

export function buildAdminQueryHref(
  pathname: string,
  currentQuery: string | URLSearchParams,
  updates: AdminQueryUpdate,
  options: BuildAdminQueryHrefOptions = {},
) {
  const params = new URLSearchParams(currentQuery.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  for (const [key, value] of params.entries()) {
    if (!value || value === "all") params.delete(key);
  }

  if (options.resetPage ?? true) params.delete("page");

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
