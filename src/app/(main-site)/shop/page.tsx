import { ShopPage } from "@/src/features/main-site/shop/containers/shop-page";
import type { ShopCategoryFilter } from "@/src/features/main-site/shop/types/shop";

type ShopRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export default async function ShopRoute({ searchParams }: ShopRouteProps) {
  const params = await searchParams;
  const requestedCategory = valueOf(params.category, "all");
  const category: ShopCategoryFilter = requestedCategory === "avatar" ? "avatar" : "all";
  const requestedPage = Number.parseInt(valueOf(params.page, "1"), 10);

  return <ShopPage category={category} page={Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1} />;
}
