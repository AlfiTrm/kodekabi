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
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/50 transition-colors hover:text-foreground"><span aria-hidden="true">&larr;</span> Kembali ke Shop</Link>

        <section className="mt-6 grid overflow-hidden rounded-3xl border border-white/10 bg-surface lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
          <div className="relative flex min-h-[24rem] items-end justify-center overflow-hidden bg-purple/15 p-8 sm:min-h-[32rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(135,112,255,0.34),transparent_55%)]" aria-hidden="true" />
            <div className="absolute left-6 top-6 flex gap-2">
              <span className="rounded-full border border-white/10 bg-background/75 px-3 py-1 font-mono text-[9px] font-bold uppercase text-purple backdrop-blur">{item.category_name}</span>
              {item.is_equipped ? <span className="rounded-full bg-orange px-3 py-1 font-mono text-[9px] font-bold uppercase text-button-ink">Dipakai</span> : null}
            </div>
            <Image src={imageUrl} alt={item.name} width={520} height={480} priority className="relative h-[21rem] w-auto max-w-full object-contain sm:h-[28rem]" />
          </div>

          <div className="flex flex-col p-6 sm:p-9 lg:p-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-purple">Koleksi Kota Nusa</p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl">{item.name}<span className="text-orange">.</span></h1>
            <p className="mt-6 text-sm leading-7 text-foreground/60">{item.description || "Item kosmetik untuk memperbarui identitas detektifmu."}</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-background/55 p-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-foreground/40">Harga</p>
                <p className="mt-2 font-display text-2xl font-bold text-orange">{item.price_coin === 0 ? "Gratis" : `${item.price_coin.toLocaleString("id-ID")} Koin`}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/55 p-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-foreground/40">Saldo kamu</p>
                <p className="mt-2 font-display text-2xl font-bold">{coinBalance.toLocaleString("id-ID")}</p>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-8">
              <p className="max-w-60 text-[10px] leading-relaxed text-foreground/40">Item yang dibeli tersimpan permanen di koleksi akunmu.</p>
              <ShopItemActionButton initialItem={item} size="wide" />
            </div>
          </div>
        </section>

        {relatedItems.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-3xl font-bold uppercase">Koleksi terkait<span className="text-purple">.</span></h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedItems.map((related) => <ShopItemCard key={related.item_id} item={related} />)}
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
