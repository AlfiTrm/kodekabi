import Link from "next/link";

export function ShopTabs() {
  return (
    <div className="flex rounded-full bg-surface p-1" aria-label="Jenis transaksi">
      <Link href="/shop" aria-current="page" className="grid h-9 min-w-24 place-items-center rounded-full bg-foreground px-5 text-[10px] font-bold text-button-ink">Shop</Link>
      <span aria-disabled="true" title="Fitur redeem segera hadir" className="grid h-9 min-w-24 cursor-not-allowed place-items-center rounded-full px-5 text-[10px] font-bold text-foreground/35">Redeem</span>
    </div>
  );
}
