type GameplayHeaderProps = {
  caseTitle: string;
  saveStatus?: "saved" | "saving" | "error";
  onPause?: () => void;
};

export function GameplayHeader({ caseTitle, saveStatus = "saved", onPause }: GameplayHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex min-h-16 items-center justify-between gap-5 border-b border-border bg-background/95 px-5 py-3 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-base font-bold">{caseTitle}</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {saveStatus !== "saved" ? <span className={`font-mono text-[9px] ${saveStatus === "error" ? "text-red" : "text-yellow"}`}>● {saveStatus === "error" ? "gagal tersimpan" : "menyimpan..."}</span> : null}
        {onPause ? <button type="button" onClick={onPause} className="rounded-full border border-border-strong px-4 py-2 text-[10px] font-semibold hover:bg-surface">Jeda</button> : null}
      </div>
    </header>
  );
}
