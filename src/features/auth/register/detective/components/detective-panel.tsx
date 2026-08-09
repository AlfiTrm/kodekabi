import Image from "next/image";

import type { Detective } from "../types/detective";

const accentClasses = {
  red: { active: "bg-red", role: "text-red" },
  purple: { active: "bg-purple", role: "text-purple" },
  blue: { active: "bg-blue", role: "text-blue" },
  orange: { active: "bg-orange", role: "text-orange" },
} as const;

type DetectivePanelProps = {
  detective: Detective;
  priority?: boolean;
  selected: boolean;
  previewed: boolean;
  onSelect: () => void;
  onPreview: (active: boolean) => void;
};

export function DetectivePanel({ detective, priority = false, selected, previewed, onSelect, onPreview }: DetectivePanelProps) {
  const accent = accentClasses[detective.accent];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      onMouseEnter={() => onPreview(true)}
      onFocus={() => onPreview(true)}
      onBlur={() => onPreview(false)}
      className={`group relative flex flex-none flex-col items-center justify-between overflow-hidden border-b border-border-strong px-5 pb-10 pt-5 text-center transition-[min-height,flex-grow,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] last:border-b-0 sm:min-h-0 sm:basis-0 sm:pb-20 sm:border-b-0 sm:border-r sm:last:border-r-0 ${previewed ? `min-h-[310px] ${accent.active} text-button-ink sm:grow-[1.8]` : "min-h-[260px] bg-surface shadow-[inset_0_0_90px_rgba(0,0,0,0.88)] sm:grow"}`}
    >
      <div className="flex w-full justify-center font-mono text-[10px] uppercase tracking-[0.14em]">
        {selected ? <span className="rounded-full bg-white px-3 py-1 font-bold tracking-normal text-button-ink shadow-[0_3px_0_rgba(15,17,24,0.18)]">Dipilih</span> : <span className={previewed ? "text-button-ink/60" : "text-foreground/25"}>Pilih</span>}
      </div>

      <div className="relative flex h-28 shrink-0 items-center justify-center py-2 sm:h-auto sm:min-h-0 sm:flex-1 sm:py-5">
        <div className={`relative flex origin-bottom items-end justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${previewed ? "scale-105" : "scale-90"}`}>
          <Image src={detective.image} alt="" aria-hidden="true" width={320} height={380} className={`absolute bottom-[12%] left-1/2 z-0 h-24 w-auto origin-bottom object-contain grayscale brightness-0 blur-[1px] transition-opacity duration-500 [transform:translateX(-50%)_scaleY(-0.32)_skewX(-18deg)] sm:h-[clamp(13rem,34vh,23rem)] ${previewed ? "opacity-45" : "opacity-20"}`} />
          <Image src={detective.image} alt={detective.name} width={320} height={380} priority={priority} className={`relative z-10 h-24 w-auto origin-bottom object-contain transition-[filter] duration-500 sm:h-[clamp(13rem,34vh,23rem)] ${previewed ? "brightness-100 grayscale-0" : "brightness-[0.38] grayscale-[88%]"}`} />
        </div>
      </div>

      <div className="w-full shrink-0 sm:min-h-28">
        <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.03em] sm:text-[clamp(1.25rem,2vw,2rem)]">{detective.name}</h2>
        <p className={`mt-1 text-xs font-bold uppercase ${previewed ? "text-button-ink/65" : accent.role}`}>{detective.role}</p>
        <p className={`mx-auto mt-3 max-w-64 text-xs leading-relaxed transition-opacity duration-300 ${previewed ? "opacity-75" : "opacity-35"}`}>{detective.description}</p>
      </div>
    </button>
  );
}
