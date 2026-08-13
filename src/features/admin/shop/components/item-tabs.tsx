import Link from "next/link";

export type ShopTab = "items" | "redeem";

const tabs = [
  { label: "Item Toko", value: "items", href: "/admin/shop" },
  { label: "Item Redeem", value: "redeem", href: "/admin/shop?tab=redeem" },
] as const;

export function ItemTabs({ active = "items" }: { active?: ShopTab }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Jenis pengelolaan toko">
      {tabs.map((tab) => (
        <Link key={tab.value} href={tab.href} className={`grid h-9 place-items-center rounded-full border px-4 text-[10px] font-semibold transition-colors ${active === tab.value ? "border-white bg-white text-button-ink" : "border-border-strong text-foreground/55 hover:border-purple hover:text-foreground"}`}>{tab.label}</Link>
      ))}
      <button type="button" disabled title="Fitur belum tersedia" className="h-9 cursor-not-allowed rounded-full border border-border-strong px-4 text-[10px] font-semibold text-foreground/30">Kode Redeem</button>
    </div>
  );
}
