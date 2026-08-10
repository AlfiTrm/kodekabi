"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { AdminIcon } from "./admin-icon";
import { adminNavigation } from "../data/navigation";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
        <Link href="/admin" className="flex items-center gap-2" aria-label="Admin dashboard">
          <Image src="/logo/logo-icon.svg" alt="" width={32} height={32} className="size-8" />
          <span className="font-display text-sm font-semibold">ADMIN CONSOLE</span>
        </Link>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="admin-sidebar" aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"} className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border-strong text-foreground/70">
          <AdminIcon name={menuOpen ? "close" : "menu"} />
        </button>
      </header>

      {menuOpen ? <button type="button" aria-label="Tutup navigasi" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 cursor-default bg-black/65 md:hidden" /> : null}

      <aside id="admin-sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface px-5 py-6 transition-transform duration-200 ease-out md:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-2" aria-label="KODEKABI Admin Console">
          <Image src="/logo/logo-icon.svg" alt="" width={38} height={38} className="size-9" />
          <span><strong className="block font-display text-base font-semibold">KODEKABI</strong><span className="block font-mono text-[7px] uppercase tracking-[0.12em] text-orange">Admin Console</span></span>
        </Link>

        <nav className="mt-8 space-y-1" aria-label="Navigasi admin">
          {adminNavigation.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`flex h-11 items-center gap-3 rounded-xl px-3 text-xs font-medium transition-colors ${active ? "border border-purple/35 bg-purple/15 text-white" : "text-foreground/50 hover:bg-surface-muted hover:text-foreground"}`}>
                <AdminIcon name={item.icon} className="size-[18px]" />{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-5">
          <div className="flex items-center gap-3 px-2">
            <Image src="/mascot/mascot-detective.webp" alt="Admin Raka" width={38} height={38} className="size-9 rounded-lg bg-purple/15 object-contain" />
            <span className="min-w-0"><strong className="block truncate text-xs">Raka S.</strong><Link href="/admin/login" className="block text-[9px] text-foreground/35 hover:text-red">Logout</Link></span>
          </div>
        </div>
      </aside>

      <main className="min-h-dvh pt-16 md:ml-64 md:pt-0">{children}</main>
    </div>
  );
}
