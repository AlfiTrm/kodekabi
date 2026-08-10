import type { ReactNode } from "react";

type AdminEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AdminEmptyState({ title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-full border border-border-strong bg-surface-muted font-mono text-lg text-foreground/30">?</span>
      <h2 className="mt-4 text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-xs leading-5 text-foreground/45">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
