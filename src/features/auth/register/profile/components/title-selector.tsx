import type { TitleCosmetic } from "../types/cosmetic";
import { DecorativeTitle } from "./decorative-title";

type TitleSelectorProps = {
  titles: readonly TitleCosmetic[];
  selectedId: string;
  previewId: string | null;
  onSelect: (id: string) => void;
  onPreview: (id: string | null) => void;
};

export function TitleSelector({ titles, selectedId, previewId, onSelect, onPreview }: TitleSelectorProps) {
  const visibleTitle = titles.find((title) => title.id === (previewId ?? selectedId)) ?? titles[0];

  return (
    <div onMouseLeave={() => onPreview(null)}>
      <div className="grid grid-cols-2 gap-2">
        {titles.map((title) => {
          const isSelected = selectedId === title.id;
          const isPreviewed = previewId === title.id;

          return (
            <button
              key={title.id}
              type="button"
              aria-pressed={isSelected}
              aria-disabled={!title.unlocked}
              onMouseEnter={() => onPreview(title.id)}
              onFocus={() => onPreview(title.id)}
              onBlur={() => onPreview(null)}
              onClick={() => {
                if (title.unlocked) onSelect(title.id);
              }}
              className={`relative flex min-h-20 items-center justify-center overflow-hidden rounded-xl border bg-surface px-3 py-4 transition-[border-color,background-color,opacity] duration-200 ${isSelected || isPreviewed ? "border-foreground/55 bg-surface-elevated" : "border-border hover:border-foreground/30"} ${title.unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-45"}`}
            >
              <DecorativeTitle title={title} compact />
              {isSelected ? <span className="absolute right-2 top-2 size-2 rounded-full bg-green" aria-label="Dipilih" /> : null}
              {!title.unlocked ? <span className="absolute right-2 top-2 rounded-full bg-background px-2 py-0.5 text-[7px] uppercase text-foreground/60">Locked</span> : null}
            </button>
          );
        })}
      </div>

      <p className="mt-3 min-h-5 text-[10px] text-foreground/45" aria-live="polite">
        {visibleTitle.unlockHint}.
      </p>
    </div>
  );
}
