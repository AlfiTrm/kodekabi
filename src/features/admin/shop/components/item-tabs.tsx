import Link from "next/link";

export type ShopTab = "items" | "redeem" | "codes";

const tabs = [
  { label: "Item Toko", value: "items", href: "/admin/shop" },
  { label: "Item Redeem", value: "redeem", href: "/admin/shop?tab=redeem" },
  { label: "Kode Redeem", value: "codes", href: "/admin/shop?tab=codes" },
] as const;

export function ItemTabs({ active = "items" }: { active?: ShopTab }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Jenis pengelolaan toko">
      {tabs.map((tab) => (
        <Link key={tab.value} href={tab.href} className={`grid h-9 place-items-center rounded-full border px-4 text-[10px] font-semibold transition-colors ${active === tab.value ? "border-white bg-white text-button-ink" : "border-border-strong text-foreground/55 hover:border-purple hover:text-foreground"}`}>{tab.label}</Link>
      ))}
    </div>
  );
}
