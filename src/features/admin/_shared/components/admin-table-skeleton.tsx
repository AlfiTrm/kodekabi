type AdminTableSkeletonProps = {
  rows?: number;
};

export function AdminTableSkeleton({ rows = 7 }: AdminTableSkeletonProps) {
  return (
    <div className="mt-5 animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-12 border-b border-border bg-surface-muted/40" />
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-16 border-b border-border last:border-0" />
      ))}
    </div>
  );
}
