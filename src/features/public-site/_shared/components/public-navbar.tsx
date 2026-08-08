"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { SiteContainer } from "@/src/shared/components/layout/site-container";
import { Button } from "@/src/shared/components/ui/button";

import { publicNavigationItems } from "../data/navigation";

export function PublicNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [buttonsReady, setButtonsReady] = useState(false);

  const mobileMenuColors = ["border-red", "border-purple", "border-green", "border-orange"];

  useEffect(() => {
    if (!menuOpen) return undefined;

    const timer = window.setTimeout(() => setButtonsReady(true), 700);
    return () => window.clearTimeout(timer);
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-background/92 backdrop-blur-xl">
      <SiteContainer>
        <div className="flex min-h-20 flex-wrap items-center gap-x-4 gap-y-3 py-4 lg:min-h-0 lg:flex-nowrap lg:py-0">
          <Link
            href="/"
            className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-90"
            aria-label="KODEKABI Beranda"
          >
            <Image
              src="/logo/logo-icon.svg"
              alt="KODEKABI"
              width={40}
              height={40}
              priority
              className="h-10 w-10 sm:hidden"
            />
            <Image
              src="/logo/logo-horizontal.svg"
              alt="KODEKABI"
              width={169}
              height={40}
              priority
              className="hidden h-auto w-[150px] sm:block lg:w-[169px]"
            />
          </Link>

          <div className="ml-auto lg:hidden">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-public-navigation"
              aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground transition-colors hover:bg-surface-elevated"
              onClick={() => {
                setButtonsReady(false);
                setMenuOpen((open) => !open);
              }}
            >
              <span className="sr-only">{menuOpen ? "Tutup navigasi" : "Buka navigasi"}</span>
              <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
                <span className={`h-0.5 w-full bg-current transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 w-full bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-full bg-current transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>

          <nav
            aria-label="Navigasi public site"
            className="hidden flex-1 justify-center lg:flex"
          >
            <ul className="flex items-center gap-10">
              {publicNavigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`inline-flex items-center py-7 text-sm font-semibold transition-opacity duration-300 ease-out ${
                      pathname === item.href
                        ? "text-foreground opacity-100"
                        : "text-white/60 opacity-60 hover:text-foreground hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Button href="/login" variant="hatch-outline">
              Masuk
            </Button>
            <Button href="/lobby" variant="detective">
              Main Gratis
            </Button>
          </div>
        </div>
      </SiteContainer>
    </header>

      {menuOpen ? (
        <div id="mobile-public-navigation" className="fixed inset-0 z-40 overflow-y-auto bg-background px-6 pb-10 pt-32 lg:hidden">
          <nav aria-label="Navigasi public site mobile">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">Buka berkas navigasi</p>
            <ul className="flex flex-col gap-3">
              {publicNavigationItems.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{ animationDelay: `${index * 90}ms`, "--menu-rotation": index % 2 === 0 ? "-2deg" : "2deg" } as CSSProperties}
                    className={`block animate-[mobile-menu-in_500ms_cubic-bezier(0.16,1,0.3,1)_both] border-l-8 bg-surface px-6 py-5 font-display text-3xl font-bold uppercase tracking-[-0.04em] text-foreground opacity-0 shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:translate-x-3 ${mobileMenuColors[index % mobileMenuColors.length]} ${index % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"} ${pathname === item.href ? "!opacity-100" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 flex flex-col items-end gap-3">
            <Button href="/lobby" variant="detective" size="compact" autoPlay={buttonsReady}>
              Main Gratis
            </Button>
            <Button href="/login" variant="hatch-outline" size="compact" autoPlay={buttonsReady}>
              Masuk
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
