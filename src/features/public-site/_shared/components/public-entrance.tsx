"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { PUBLIC_ENTRANCE_STORAGE_KEY } from "../constants/entrance";

const HEX_GLYPHS = "0123456789ABCDEF";
const BRAND_TEXT = "KODEKABI";
const WORDMARK_TEXT_CLASS =
  "absolute origin-left scale-x-90 whitespace-nowrap font-display text-[42px] font-semibold leading-none tracking-[0.02em] text-foreground sm:text-[78px]";

function wait(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

function runScramble(element: HTMLElement, duration: number) {
  return new Promise<void>((resolve) => {
    const startedAt = performance.now();

    function update(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const resolvedCharacters = Math.floor(progress * BRAND_TEXT.length);

      element.textContent = BRAND_TEXT.split("")
        .map((character, index) => {
          if (index < resolvedCharacters || progress === 1) return character;
          return HEX_GLYPHS[Math.floor(Math.random() * HEX_GLYPHS.length)];
        })
        .join("");

      if (progress < 1) {
        window.requestAnimationFrame(update);
        return;
      }

      resolve();
    }

    window.requestAnimationFrame(update);
  });
}

export function PublicEntrance() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const scrambleRef = useRef<HTMLSpanElement>(null);
  const finalWordmarkRef = useRef<HTMLSpanElement>(null);
  const reversedERef = useRef<HTMLSpanElement>(null);
  const kabiRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const icon = iconRef.current;
    const wordmark = wordmarkRef.current;
    const scramble = scrambleRef.current;
    const finalWordmark = finalWordmarkRef.current;
    const reversedE = reversedERef.current;
    const kabi = kabiRef.current;
    const navbarBrand = document.querySelector<HTMLElement>("[data-public-navbar-brand]");

    if (
      !["new", "playing"].includes(root.dataset.kodekabiEntrance ?? "") ||
      !overlay ||
      !stage ||
      !icon ||
      !wordmark ||
      !scramble ||
      !finalWordmark ||
      !reversedE ||
      !kabi ||
      !navbarBrand
    ) {
      return undefined;
    }

    let cancelled = false;
    const previousOverflow = root.style.overflow;
    overlay.dataset.introActive = "true";
    root.dataset.kodekabiEntrance = "playing";
    root.style.overflow = "hidden";

    const complete = async () => {
      if (cancelled) return;

      try {
        window.localStorage.setItem(PUBLIC_ENTRANCE_STORAGE_KEY, "true");
      } catch {
        // The intro still completes when browser privacy settings block storage.
      }
      root.dataset.kodekabiEntrance = "seen";

      await overlay.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 140, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" },
      ).finished;

      overlay.hidden = true;
      delete overlay.dataset.introActive;
      root.style.overflow = previousOverflow;
    };

    const play = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        await complete();
        return;
      }

      const stageWidth = stage.getBoundingClientRect().width;
      const iconWidth = icon.getBoundingClientRect().width;
      const centeredOffset = (stageWidth - iconWidth) / 2;

      await icon.animate(
        [
          {
            opacity: 0,
            transform: `translateX(${centeredOffset}px) scale(0.01) rotate(-2160deg)`,
          },
          {
            opacity: 1,
            transform: `translateX(${centeredOffset}px) scale(0.05) rotate(-1260deg)`,
            offset: 0.24,
          },
          {
            opacity: 1,
            transform: `translateX(${centeredOffset}px) scale(0.55) rotate(720deg)`,
            offset: 0.64,
          },
          {
            opacity: 1,
            transform: `translateX(${centeredOffset}px) scale(1.08) rotate(1740deg)`,
            offset: 0.9,
          },
          {
            opacity: 1,
            transform: `translateX(${centeredOffset}px) scale(1) rotate(1800deg)`,
          },
        ],
        {
          duration: 1480,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      ).finished;

      if (cancelled) return;

      const iconDock = icon.animate(
        [
          { transform: `translateX(${centeredOffset}px) scale(1) rotate(1800deg)` },
          { transform: "translateX(0) scale(1) rotate(1800deg)" },
        ],
        {
          duration: 340,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      ).finished;

      const wordmarkReveal = wordmark.animate(
        [
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0 0 0)", opacity: 1 },
        ],
        {
          duration: 860,
          delay: 90,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      ).finished;

      await Promise.all([iconDock, wordmarkReveal, runScramble(scramble, 1280)]);

      scramble.style.opacity = "0";
      finalWordmark.style.opacity = "1";

      await Promise.all([
        reversedE.animate(
          [{ transform: "scaleX(1)" }, { transform: "scaleX(-1)" }],
          { duration: 460, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
        ).finished,
        kabi.animate(
          [{ color: "var(--foreground)" }, { color: "var(--orange)" }],
          { duration: 360, easing: "steps(3, end)", fill: "forwards" },
        ).finished,
      ]);

      await wait(220);
      if (cancelled) return;

      const targetRect = navbarBrand.getBoundingClientRect();
      const isIconTarget = targetRect.width < 80;

      if (isIconTarget) {
        await wordmark.animate(
          [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: "translateX(-12px)" }],
          { duration: 120, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" },
        ).finished;

        const iconRect = icon.getBoundingClientRect();
        const iconScale = targetRect.width / iconRect.width;
        await icon.animate(
          [
            { transform: "translate(0, 0) scale(1) rotate(1800deg)" },
            {
              transform: `translate(${targetRect.left - iconRect.left}px, ${targetRect.top - iconRect.top}px) scale(${iconScale}) rotate(1800deg)`,
            },
          ],
          {
            duration: 620,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          },
        ).finished;
      } else {
        const stageRect = stage.getBoundingClientRect();
        const stageScaleX = targetRect.width / stageRect.width;
        const stageScaleY = targetRect.height / stageRect.height;
        await stage.animate(
          [
            { transform: "translate(0, 0) scale(1)" },
            {
              transform: `translate(${targetRect.left - stageRect.left}px, ${targetRect.top - stageRect.top}px) scale(${stageScaleX}, ${stageScaleY})`,
            },
          ],
          {
            duration: 680,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          },
        ).finished;
      }

      await complete();
    };

    void play().catch(() => {
      if (!cancelled) void complete();
    });

    return () => {
      cancelled = true;
      root.style.overflow = previousOverflow;
      overlay.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="first-visit-entrance fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
      aria-hidden="true"
    >
      <div
        ref={stageRef}
        className="relative h-[76px] w-[340px] origin-top-left sm:h-[132px] sm:w-[620px]"
      >
        <Image
          ref={iconRef}
          src="/logo/logo-icon.svg"
          alt=""
          width={132}
          height={132}
          priority
          className="absolute inset-y-0 left-0 h-full w-auto opacity-0 will-change-transform"
        />

        <div
          ref={wordmarkRef}
          className="absolute inset-y-0 left-[27%] right-0 flex items-center overflow-hidden opacity-0"
        >
          <span
            ref={scrambleRef}
            className={WORDMARK_TEXT_CLASS}
          >
            00000000
          </span>
          <span
            ref={finalWordmarkRef}
            className={`${WORDMARK_TEXT_CLASS} opacity-0`}
            aria-label="KODEKABI"
          >
            KOD<span ref={reversedERef} className="inline-block">E</span>
            <span ref={kabiRef}>KABI</span>
          </span>
        </div>
      </div>
    </div>
  );
}
