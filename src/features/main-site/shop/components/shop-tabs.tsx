import Link from "next/link";

export function ShopTabs({ active = "shop" }: { active?: "shop" | "redeem" }) {
  const tabClass = "grid h-9 min-w-24 place-items-center rounded-full px-5 text-[10px] font-bold transition-colors";

  return (
    <div className="flex rounded-full bg-surface p-1" aria-label="Jenis transaksi">
      <Link href="/shop" aria-current={active === "shop" ? "page" : undefined} className={`${tabClass} ${active === "shop" ? "bg-foreground text-button-ink" : "text-foreground/45 hover:text-foreground"}`}>Shop</Link>
      <Link href="/shop/redeem" aria-current={active === "redeem" ? "page" : undefined} className={`${tabClass} ${active === "redeem" ? "bg-foreground text-button-ink" : "text-foreground/45 hover:text-foreground"}`}>Redeem</Link>
    </div>
  );
}
