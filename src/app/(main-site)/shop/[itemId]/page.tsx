import { ShopItemDetailPage } from "@/src/features/main-site/shop/containers/shop-item-detail-page";

type ShopItemRouteProps = {
  params: Promise<{ itemId: string }>;
};

export default async function ShopItemRoute({ params }: ShopItemRouteProps) {
  const { itemId } = await params;
  return <ShopItemDetailPage itemId={itemId} />;
}
