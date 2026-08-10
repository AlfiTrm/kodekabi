import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
  breadcrumb?: ReactNode;
};

export function AdminPageHeader({ title, description, action, breadcrumb }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumb ? <div className="mb-3 text-[10px] text-foreground/40">{breadcrumb}</div> : null}
        <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.03em] sm:text-4xl">{title}<span className="text-purple">.</span></h1>
        <p className="mt-1.5 text-xs text-foreground/45">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
