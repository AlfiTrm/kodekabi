import type { CSSProperties } from "react";

import type { CityStat } from "../types/city-stat";

type CityStatItemProps = {
  stat: CityStat;
};

export function CityStatItem({ stat }: CityStatItemProps) {
  const color = stat.tone === "green" ? "var(--green)" : "var(--red)";
  const ringStyle = {
    "--stat-value": stat.value,
    "--stat-color": color,
  } as CSSProperties;

  return (
    <div className="flex min-w-24 flex-col items-center text-center sm:min-w-28">
      <div
        style={ringStyle}
        className="relative grid size-14 place-items-center rounded-full bg-[conic-gradient(var(--stat-color)_calc(var(--stat-value)*1%),rgba(255,255,255,0.16)_0)] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:size-16"
      >
        <span className="grid size-full place-items-center rounded-full border-2 border-foreground/75 bg-background/90 font-display text-xl font-bold text-[var(--stat-color)] sm:text-2xl">
          {stat.value}
        </span>
      </div>
      <p className="mt-2 font-display text-[10px] font-semibold uppercase leading-none text-foreground sm:text-xs">{stat.label}</p>
      <p className={`mt-1 text-[9px] font-bold leading-none ${stat.tone === "green" ? "text-green" : "text-red"}`}>{stat.delta}</p>
    </div>
  );
}

