import type {
  AvatarCosmetic,
  AvatarFrameCosmetic,
  BannerCosmetic,
  CitySkinCosmetic,
  EquippedCosmetics,
  TitleCosmetic,
} from "../types/cosmetic";

export const avatars = [
  { id: "kabitektif-default", kind: "avatar", label: "Kabitektif", rarity: "starter", unlocked: true, unlockHint: "Avatar awal", image: "/mascot/mascot-jacket.webp" },
  { id: "kabirius-default", kind: "avatar", label: "Kabirius", rarity: "starter", unlocked: true, unlockHint: "Avatar awal", image: "/mascot/mascot-detective.webp" },
  { id: "kabinter-default", kind: "avatar", label: "Kabinter", rarity: "starter", unlocked: true, unlockHint: "Avatar awal", image: "/mascot/mascot-sweater.webp" },
  { id: "kabiten-default", kind: "avatar", label: "Kabiten", rarity: "starter", unlocked: true, unlockHint: "Avatar awal", image: "/mascot/mascot-cloak.webp" },
] as const satisfies readonly AvatarCosmetic[];

export const avatarFrames = [
  { id: "standard-frame", kind: "avatar-frame", label: "Bingkai Standar", rarity: "starter", unlocked: true, unlockHint: "Bingkai awal", style: "standard" },
  { id: "case-ring", kind: "avatar-frame", label: "Case Ring", rarity: "rare", unlocked: false, unlockHint: "Pecahkan 25 kasus", style: "case-ring" },
] as const satisfies readonly AvatarFrameCosmetic[];

export const titles = [
  { id: "rookie", kind: "title", label: "Detektif Baru", rarity: "starter", unlocked: true, unlockHint: "Title awal", style: "recruit" },
  { id: "fact-hunter", kind: "title", label: "Pemburu Fakta", rarity: "uncommon", unlocked: true, unlockHint: "Selesaikan 3 kasus", style: "evidence" },
  { id: "skeptic", kind: "title", label: "Si Paling Skeptis", rarity: "rare", unlocked: true, unlockHint: "Bantah 5 klaim palsu", style: "skeptic" },
  { id: "city-guardian", kind: "title", label: "Penjaga Kota", rarity: "legendary", unlocked: false, unlockHint: "Capai reputasi 1.000", style: "guardian" },
] as const satisfies readonly TitleCosmetic[];

export const banners = [
  { id: "nusa-file", kind: "banner", label: "Nusa File", rarity: "starter", unlocked: true, unlockHint: "Banner awal", style: "nusa-file" },
  { id: "night-watch", kind: "banner", label: "Night Watch", rarity: "rare", unlocked: false, unlockHint: "Selesaikan kasus malam", style: "night-watch" },
] as const satisfies readonly BannerCosmetic[];

export const citySkins = [
  { id: "kota-nusa", kind: "city-skin", label: "Kota Nusa", rarity: "starter", unlocked: true, unlockHint: "City skin awal" },
] as const satisfies readonly CitySkinCosmetic[];

export const defaultEquippedCosmetics: EquippedCosmetics = {
  avatarId: avatars[0].id,
  avatarFrameId: avatarFrames[0].id,
  titleId: titles[0].id,
  bannerId: banners[0].id,
  citySkinId: citySkins[0].id,
};
