type AdminLoadingScreenProps = {
  overlay?: boolean;
};

export function AdminLoadingScreen({ overlay = false }: AdminLoadingScreenProps) {
  return (
    <div
      className={`grid place-items-center bg-background ${overlay ? "fixed inset-x-0 bottom-0 top-16 z-30 md:left-64 md:top-0" : "min-h-[calc(100dvh-4rem)] md:min-h-dvh"}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Admin Console"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="size-8 animate-spin rounded-full border-2 border-foreground/15 border-t-purple motion-reduce:animate-none" aria-hidden="true" />
        <span className="font-mono text-[9px] text-foreground/40">Memuat console...</span>
      </div>
    </div>
  );
}
