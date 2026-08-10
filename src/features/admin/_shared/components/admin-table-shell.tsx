import type { ReactNode } from "react";

type AdminTableShellProps = {
  children: ReactNode;
  footer: ReactNode;
};

export function AdminTableShell({ children, footer }: AdminTableShellProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">{children}</div>
      <footer className="flex min-h-16 flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">{footer}</footer>
    </section>
  );
}
