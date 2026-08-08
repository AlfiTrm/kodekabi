"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Footprint } from "./footprint";

export const PAGE_LOADING_EVENT = "kodekabi:page-loading";

const FOOTPRINTS = [
  { left: "22%", top: "67%", rotation: "-24deg", color: "text-orange" },
  { left: "35%", top: "53%", rotation: "18deg", color: "text-red" },
  { left: "48%", top: "42%", rotation: "-18deg", color: "text-purple" },
  { left: "61%", top: "29%", rotation: "22deg", color: "text-green" },
  { left: "74%", top: "17%", rotation: "-20deg", color: "text-orange" },
] as const;

export function startPageLoading() {
  window.dispatchEvent(new Event(PAGE_LOADING_EVENT));
}

type PageLoaderProps = {
  label: string;
};

export function PageLoader({ label }: PageLoaderProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const initialRenderRef = useRef(true);
  const shownAtRef = useRef(0);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current);

    const minimumVisible = initialRenderRef.current ? 260 : 160;
    const elapsed = shownAtRef.current > 0 ? performance.now() - shownAtRef.current : 0;
    const hideDelay = initialRenderRef.current ? minimumVisible : Math.max(90, minimumVisible - elapsed);

    hideTimerRef.current = window.setTimeout(() => {
      overlay.dataset.active = "false";
      initialRenderRef.current = false;
    }, hideDelay);

    return () => {
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    };
  }, [pathname]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;
    const loaderElement = overlay;

    function showLoader(delay = 80) {
      if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current);

      showTimerRef.current = window.setTimeout(() => {
        shownAtRef.current = performance.now();
        loaderElement.dataset.active = "true";
        loaderElement.getAnimations({ subtree: true }).forEach((animation) => {
          animation.currentTime = 0;
          animation.play();
        });

        safetyTimerRef.current = window.setTimeout(() => {
          loaderElement.dataset.active = "false";
        }, 10000);
      }, delay);
    }

    function handleDocumentClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      showLoader();
    }

    const handleProgrammaticNavigation = () => showLoader();
    const handleHistoryNavigation = () => showLoader(0);

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener(PAGE_LOADING_EVENT, handleProgrammaticNavigation);
    window.addEventListener("popstate", handleHistoryNavigation);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener(PAGE_LOADING_EVENT, handleProgrammaticNavigation);
      window.removeEventListener("popstate", handleHistoryNavigation);
      if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      data-active="true"
      className="fixed inset-0 z-[90] overflow-hidden bg-background opacity-100 transition-opacity duration-150 ease-out data-[active=false]:pointer-events-none data-[active=false]:opacity-0"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="absolute inset-0 mx-auto max-w-5xl">
        {FOOTPRINTS.map((footprint, index) => (
          <span
            key={`${footprint.left}-${footprint.top}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: footprint.left, top: footprint.top, rotate: footprint.rotation }}
          >
            <Footprint
              className={`h-16 w-9 opacity-0 ${footprint.color} ${index % 2 === 0 ? "scale-x-[-1]" : ""} animate-[footprint-stamp_820ms_cubic-bezier(0.16,1,0.3,1)_infinite] motion-reduce:animate-none motion-reduce:opacity-60 sm:h-20 sm:w-11`}
              style={{ animationDelay: `${index * 85}ms` }}
            />
          </span>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-3 px-6 text-center">
        <span className="h-px w-14 bg-orange" />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70 sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
}
