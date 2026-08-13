import Link from "next/link";

const tabs = [
  { label: "General", value: "general", href: "/admin/config", enabled: true },
  { label: "XP & Level", value: "xp-level", href: "/admin/config?tab=xp-level", enabled: true },
  { label: "Daily Case", value: "daily-case", href: "#", enabled: false },
  { label: "AI Config", value: "ai-config", href: "#", enabled: false },
] as const;

export function GameConfigTabs({ activeTab }: { activeTab: "general" | "xp-level" }) {
  return (
    <nav aria-label="Bagian konfigurasi game" className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = tab.value === activeTab;
        const className = `inline-flex h-9 items-center rounded-full px-5 text-xs font-semibold transition-colors ${active ? "bg-white text-button-ink" : tab.enabled ? "border border-border-strong text-foreground/55 hover:border-purple hover:text-purple" : "cursor-not-allowed border border-border-strong text-foreground/30"}`;

        return tab.enabled ? (
          <Link key={tab.value} href={tab.href} aria-current={active ? "page" : undefined} className={className}>
            {tab.label}
          </Link>
        ) : (
          <span key={tab.value} title="Konfigurasi ini akan tersedia pada tahap berikutnya" className={className}>
            {tab.label}
          </span>
        );
      })}
    </nav>
  );
}
