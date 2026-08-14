"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminLoadingScreen } from "./admin-loading-screen";

export function AdminRouteLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(false), 160);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    let safetyTimer: number | undefined;

    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      setActive(true);
      if (safetyTimer) window.clearTimeout(safetyTimer);
      safetyTimer = window.setTimeout(() => setActive(false), 10_000);
    }

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      if (safetyTimer) window.clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div className={`transition-opacity duration-150 ${active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!active}>
      <AdminLoadingScreen overlay />
    </div>
  );
}
