export type CosmeticRarity = "starter" | "uncommon" | "rare" | "legendary";
export type TitleStyle = "recruit" | "evidence" | "skeptic" | "guardian";
export type BannerStyle = "nusa-file" | "night-watch";
export type FrameStyle = "standard" | "case-ring";

type CosmeticBase = {
  id: string;
  label: string;
  rarity: CosmeticRarity;
  unlocked: boolean;
  unlockHint: string;
};

export type AvatarCosmetic = CosmeticBase & {
  kind: "avatar";
  image: string;
};

export type AvatarFrameCosmetic = CosmeticBase & {
  kind: "avatar-frame";
  style: FrameStyle;
  asset?: string;
};

export type TitleCosmetic = CosmeticBase & {
  kind: "title";
  style: TitleStyle;
};

export type BannerCosmetic = CosmeticBase & {
  kind: "banner";
  style: BannerStyle;
  asset?: string;
};

export type CitySkinCosmetic = CosmeticBase & {
  kind: "city-skin";
  preview?: string;
};

export type EquippedCosmetics = {
  avatarId: string;
  avatarFrameId: string;
  titleId: string;
  bannerId: string;
  citySkinId: string;
};

