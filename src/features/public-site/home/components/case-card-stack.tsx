"use client";

import Image from "next/image";
import { useState, type CSSProperties, type PointerEvent } from "react";

import type { CaseCard } from "../data/case-cards";

const positionConfig = {
  "far-left": { x: "calc(var(--fan-step) * -2)", y: "var(--fan-outer-rise)", rotation: "-14deg", z: "z-[1]" },
  left: { x: "calc(var(--fan-step) * -1)", y: "var(--fan-rise)", rotation: "-7deg", z: "z-[2]" },
  center: { x: "0px", y: "0px", rotation: "0deg", z: "z-[5]" },
  right: { x: "var(--fan-step)", y: "var(--fan-rise)", rotation: "7deg", z: "z-[2]" },
  "far-right": { x: "calc(var(--fan-step) * 2)", y: "var(--fan-outer-rise)", rotation: "14deg", z: "z-[1]" },
} as const;

const toneAccent = {
  blue: "var(--blue)",
  purple: "var(--purple)",
  red: "var(--red)",
  green: "var(--green)",
  orange: "var(--orange)",
} as const;

function CaseCardView({ card }: { card: CaseCard }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const position = positionConfig[card.position];

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    setActive(true);
    setTilt({
      x: Number((relativeY * -4).toFixed(2)),
      y: Number((relativeX * 4).toFixed(2)),
    });
  }

  return (
    <article
      aria-label={card.title}
      className={`absolute bottom-[calc(var(--card-y)*-1)] left-[calc(50%+var(--card-x)-var(--card-half))] flex h-[518px] w-[358px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/16 p-6 text-button-ink shadow-[0_24px_44px_rgba(0,0,0,0.24)] transition-[filter,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:brightness-105 hover:shadow-[0_30px_54px_rgba(0,0,0,0.32)] max-[900px]:bottom-[-64px] max-[900px]:h-[350px] max-[900px]:w-[230px] max-[900px]:rounded-[18px] max-[900px]:p-4 max-[640px]:h-[285px] max-[640px]:w-[190px] max-[640px]:rounded-2xl max-[640px]:p-[13px] ${position.z}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={
        {
          backgroundColor: card.backgroundColor ?? toneAccent[card.tone],
          "--card-x": position.x,
          "--card-y": position.y,
          "--rotation": position.rotation,
          transform: `${active ? "translateY(-8px) " : ""}rotate(var(--rotation)) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
        } as CSSProperties
      }
    >
      <Image src={card.thumbnail} alt="" fill sizes="(max-width: 640px) 190px, (max-width: 900px) 230px, 358px" className="pointer-events-none z-0 object-cover" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-40"
        style={{ backgroundColor: toneAccent[card.tone] }}
      />
      <div className="relative z-10 text-foreground">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.08em] opacity-70 max-[640px]:text-[7px]">{card.eyebrow}</span>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-bold text-button-ink">
            <span aria-hidden="true" className="size-[9px] rotate-45 bg-current" />
            {card.score}
          </span>
        </div>
        <h2 className="mt-2 max-w-[230px] font-display text-4xl font-bold uppercase leading-[0.88] tracking-[-0.04em] max-[900px]:text-[28px] max-[640px]:text-[23px]">
          {card.title}
        </h2>
      </div>
    </article>
  );
}

export function CaseCardStack({ cards }: { cards: CaseCard[] }) {
  return (
    <section className="relative z-10 -mt-10 overflow-visible border-b border-border bg-background px-6 pb-30">
      <div className="mx-auto">
        <div className="relative mx-auto h-[518px] max-w-[1260px] [--card-half:179px] [--fan-outer-rise:80px] [--fan-rise:35px] [--fan-step:205px] [perspective:900px] max-[900px]:h-[470px] max-[900px]:[--card-half:115px] max-[900px]:[--fan-outer-rise:54px] max-[900px]:[--fan-rise:24px] max-[900px]:[--fan-step:135px] max-[640px]:mx-[-120px] max-[640px]:h-[390px] max-[640px]:[--card-half:95px] max-[640px]:[--fan-outer-rise:34px] max-[640px]:[--fan-rise:16px] max-[640px]:[--fan-step:100px]">
          {cards.map((card) => <CaseCardView key={card.id} card={card} />)}
        </div>
      </div>
    </section>
  );
}
