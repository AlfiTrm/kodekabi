import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import { ShopItemActionButton } from "../components/shop-item-action-button";
import { ShopItemCard } from "../components/shop-item-card";
import { getUserShopItem } from "../services/user-shop-service";

export async function ShopItemDetailPage({ itemId }: { itemId: string }) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  let result: Awaited<ReturnType<typeof getUserShopItem>>;
  try {
    result = await getUserShopItem(itemId, accessToken);
  } catch {
    return <ShopItemError />;
  }

  const { item, related_items: relatedItems, coin_balance: coinBalance } = result;
  const imageUrl = getTrustedImageUrl(item.image_url) ?? "/mascot/mascot-jacket.webp";

  return (
    <main className="min-h-screen flex-1 bg-background pb-20 pt-28 sm:pt-32">
      <SiteContainer>
        <Link href="/shop" className="inline-flex h-9 items-center gap-2 rounded-full border border-border-strong px-5 text-[10px] font-semibold text-foreground/65 transition-colors hover:border-foreground/35 hover:text-foreground"><span aria-hidden="true">&larr;</span> Kembali</Link>

        <section className="mt-7 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-12">
          <div className="relative flex min-h-[23rem] items-center justify-center overflow-hidden rounded-3xl border border-purple bg-purple/15 p-8 sm:min-h-[31rem]">
            <Image src={imageUrl} alt={item.name} width={520} height={480} priority className="relative h-[20rem] w-auto max-w-full object-contain sm:h-[27rem]" />
          </div>

          <div className="flex flex-col py-1 lg:py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-purple/35 bg-purple/10 px-3 py-1 font-mono text-[9px] font-bold uppercase text-purple">{item.category_name}</span>
              {item.is_equipped ? <span className="rounded-full bg-orange px-3 py-1 font-mono text-[9px] font-bold uppercase text-button-ink">Dipakai</span> : null}
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl">{item.name}</h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-foreground/55">{item.description || "Item kosmetik untuk memperbarui identitas detektifmu."}</p>

            <div className="mt-8 border-t border-white/8 pt-7">
              <div className="rounded-2xl border border-white/8 bg-surface p-5">
                <p className="flex items-center gap-3 font-display text-3xl font-bold text-orange">
                  <span className="size-4 rounded-full bg-orange shadow-[inset_0_-3px_0_var(--orange-shadow)]" aria-hidden="true" />
                  {item.price_coin === 0 ? "Gratis" : `${item.price_coin.toLocaleString("id-ID")} Koin`}
                </p>
                <p className="mt-3 text-[10px] text-foreground/40">Saldo kamu: <strong className="text-foreground/75">{coinBalance.toLocaleString("id-ID")} Koin</strong></p>
              </div>
              <div className="mt-4"><ShopItemActionButton initialItem={item} size="full" coinBalance={coinBalance} /></div>
              <p className="mt-4 text-[9px] leading-relaxed text-foreground/35">Item ini bersifat kosmetik dan tidak memengaruhi gameplay detektif atau performa kasusmu.</p>
            </div>
          </div>
        </section>

        {relatedItems.length > 0 ? (
          <section className="mt-12 overflow-hidden">
            <h2 className="font-display text-3xl font-bold uppercase">Item serupa<span className="text-purple">.</span></h2>
            <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-color:var(--border-strong)_transparent] [scrollbar-width:thin]" aria-label="Item shop serupa">
              {relatedItems.map((related) => (
                <div key={related.item_id} className="w-[17.5rem] shrink-0 snap-start sm:w-[19rem]">
                  <ShopItemCard item={related} coinBalance={coinBalance} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </SiteContainer>
    </main>
  );
}

function ShopItemError() {
  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-background px-5 pt-20">
      <div className="max-w-md rounded-3xl border border-red/30 bg-red/5 px-7 py-10 text-center">
        <h1 className="font-display text-3xl font-semibold">Item tidak dapat dibuka.</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground/50">Item mungkin sudah tidak tersedia atau koneksi ke shop terputus.</p>
        <Link href="/shop" className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-xs font-bold text-button-ink">Kembali ke Shop</Link>
      </div>
    </main>
  );
}
