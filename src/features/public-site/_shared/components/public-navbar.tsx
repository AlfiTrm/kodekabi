"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteContainer } from "@/src/shared/components/layout/site-container";
import { Button } from "@/src/shared/components/ui/button";

import { publicNavigationItems } from "../data/navigation";

export function PublicNavbar() {
  const pathname = usePathname();

  return (
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

          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:hidden">
            <Button href="/lobby" variant="hatch-outline" size="compact">
              Masuk
            </Button>
            <Button href="/lobby" variant="detective" size="compact">
              Main Gratis
            </Button>
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
            <Button href="/lobby" variant="hatch-outline">
              Masuk
            </Button>
            <Button href="/lobby" variant="detective">
              Main Gratis
            </Button>
          </div>
        </div>
      </SiteContainer>

      <div className="border-t border-white/4 lg:hidden">
        <SiteContainer className="overflow-x-auto">
          <nav aria-label="Navigasi public site mobile">
            <ul className="flex min-w-max items-center gap-6 py-3.5">
              {publicNavigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`inline-flex items-center py-1 text-sm font-semibold transition-opacity duration-300 ease-out ${
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
        </SiteContainer>
      </div>
    </header>
  );
}
