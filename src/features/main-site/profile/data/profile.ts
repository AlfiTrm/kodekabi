import type { CaseHistoryItem, DetectiveSkill, ProfileBadge, ProfileTitle } from "../types/profile";

export const detectiveSkills: DetectiveSkill[] = [
  { label: "Evidence Evaluation", value: 78, tone: "blue" },
  { label: "Claim Analysis", value: 71, tone: "purple" },
  { label: "Confidence Calibration", value: 62, tone: "orange" },
  { label: "Reasoning", value: 74, tone: "red" },
  { label: "Safety Judgment", value: 83, tone: "green" },
];

export const profileBadges: ProfileBadge[] = [
  { id: "cases-10", label: "10 kasus", symbol: "10", tone: "red", unlocked: true },
  { id: "safe-call", label: "Safety", symbol: "✓", tone: "green", unlocked: true },
  { id: "streak-7", label: "7 hari", symbol: "7", tone: "orange", unlocked: true },
  { id: "sharp-eye", label: "Mata jeli", symbol: "★", tone: "purple", unlocked: true },
  { id: "locked-1", label: "Terkunci", symbol: "?", tone: "red", unlocked: false },
  { id: "locked-2", label: "Terkunci", symbol: "?", tone: "green", unlocked: false },
  { id: "locked-3", label: "Terkunci", symbol: "?", tone: "orange", unlocked: false },
  { id: "locked-4", label: "Terkunci", symbol: "?", tone: "purple", unlocked: false },
];

export const profileTitles: ProfileTitle[] = [
  { id: "rookie", kind: "title", label: "Detektif Baru", rarity: "starter", unlocked: true, unlockHint: "Title awal", style: "recruit" },
  { id: "fact-hunter", kind: "title", label: "Pemburu Fakta", rarity: "uncommon", unlocked: true, unlockHint: "Selesaikan 3 kasus", style: "evidence" },
  { id: "skeptic", kind: "title", label: "Si Paling Skeptis", rarity: "rare", unlocked: true, unlockHint: "Bantah 5 klaim palsu", style: "skeptic" },
  { id: "guardian", kind: "title", label: "Penjaga Kota", rarity: "legendary", unlocked: false, unlockHint: "Capai level 10", style: "guardian", requirement: "LV 10" },
];

export const profileDetective = { name: "Kabitektif", image: "/mascot/mascot-jacket.webp" } as const;
export const profileBanner = { id: "nusa-file", kind: "banner", label: "Nusa File", rarity: "starter", unlocked: true, unlockHint: "Banner awal", style: "nusa-file" } as const;
export const profileStats = { level: 7, cases: 14, reputation: 820, accuracy: 86 } as const;

export const caseHistory: CaseHistoryItem[] = [
  { id: "vitamin", title: "Vitamin Ajaib Viral", meta: "4 Agu · Daily · +240 XP", result: "✓ ★★", tone: "red" },
  { id: "headline", title: "Judul Bombastis Koran Nusa", meta: "2 Agu · +80 XP", result: "● ★", tone: "green" },
  { id: "forum", title: "Thread Forum RT 12", meta: "30 Jul · Bisa diulang", result: "! Coba lagi", tone: "blue" },
];

export const nicknameSuggestions = ["AlyaJelita", "KabiJeli", "JejakTajam", "NusaKritis", "RadarFakta"] as const;
