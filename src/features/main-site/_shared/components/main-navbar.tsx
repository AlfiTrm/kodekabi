"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { mainNavigationItems } from "../data/navigation";
import { getTrustedImageUrl } from "../utils/remote-media";
import type { LobbyLevel, LobbyProfile } from "../../lobby/types/lobby";

type MainNavbarProps = {
  profile?: LobbyProfile;
  level?: LobbyLevel;
};

export function MainNavbar({ profile, level }: MainNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const avatarUrl = getTrustedImageUrl(profile?.avatar_url) ?? "/mascot/mascot-jacket.webp";
  const progress = Math.min(100, Math.max(0, level?.progress_percent ?? 0));
  const currentLevel = level?.current_level ?? 1;
  const currentXp = level?.current_xp ?? 0;
  const nextLevelXp = level?.next_level_xp ?? 0;

  useEffect(() => {
    function updateNavbar() {
      setScrolled(window.scrollY > 20);
    }

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    return () => window.removeEventListener("scroll", updateNavbar);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-white/10 bg-background/85 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <SiteContainer>
        <div className="flex h-16 items-center gap-4 sm:h-[76px]">
          <Link href="/lobby" className="shrink-0 transition-transform duration-200 hover:scale-105" aria-label="KODEKABI Lobby">
            <Image src="/logo/logo-icon.svg" alt="" width={42} height={42} priority className="size-9 sm:size-10" />
          </Link>

          <nav aria-label="Navigasi utama" className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex w-max items-center gap-1 sm:gap-2">
              {mainNavigationItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`inline-flex h-9 items-center rounded-full px-3 text-[10px] font-semibold transition-[background-color,color,opacity] duration-200 sm:px-4 sm:text-xs ${
                        active
                          ? "bg-foreground text-button-ink"
                          : "text-foreground/65 hover:bg-white/8 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden h-9 items-center gap-2 rounded-full border border-white/10 bg-surface/75 px-3 text-[10px] font-bold shadow-lg sm:flex">
              <span className="size-4 rounded-full bg-orange shadow-[inset_0_-2px_0_var(--orange-shadow)]" aria-hidden="true" />
              <span>{(profile?.coin_balance ?? 0).toLocaleString("id-ID")}</span>
              <span className="flex size-4 items-center justify-center rounded-full bg-green text-[11px] text-background" aria-hidden="true">+</span>
            </div>

            <div className="group relative">
              <button
                type="button"
                aria-describedby="player-level-tooltip"
                className="flex h-9 items-center gap-1.5 rounded-full border border-purple/20 bg-purple/15 px-3 text-[10px] font-bold text-purple transition-colors hover:bg-purple/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
              >
                <span className="text-[8px] uppercase tracking-[0.12em] text-foreground/50">Lv</span>
                <span>{currentLevel}</span>
              </button>

              <div
                id="player-level-tooltip"
                role="tooltip"
                className="pointer-events-none absolute right-0 top-[calc(100%+12px)] w-52 translate-y-1 rounded-2xl border border-white/10 bg-surface-elevated/95 p-4 opacity-0 shadow-2xl backdrop-blur-xl transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:w-56"
              >
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-foreground/45">Level pemain</p>
                    <p className="mt-1 font-display text-xl font-semibold text-foreground">{level?.title || profile?.title || "Auditor Baru"}</p>
                  </div>
                  <span className="text-[10px] font-bold text-purple">{Math.round(progress)}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10">
                  <span className="block h-full rounded-full bg-purple" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[9px] text-foreground/50">
                  <span>{currentXp.toLocaleString("id-ID")} XP</span>
                  <span>{nextLevelXp.toLocaleString("id-ID")} XP</span>
                </div>
                <p className="mt-3 border-t border-white/8 pt-3 text-[9px] leading-relaxed text-foreground/55">
                  {(level?.remaining_xp ?? 0).toLocaleString("id-ID")} XP lagi menuju level {level?.next_level ?? currentLevel + 1}.
                </p>
              </div>
            </div>

            <Link href="/profile" className="relative block rounded-full" aria-label="Buka profil">
              <span className="flex size-10 items-end justify-center overflow-hidden rounded-full bg-surface-elevated">
                <Image src={avatarUrl} alt="" width={48} height={48} className="h-10 w-auto object-contain" />
              </span>
            </Link>
          </div>
        </div>
      </SiteContainer>
    </header>
  );
}
