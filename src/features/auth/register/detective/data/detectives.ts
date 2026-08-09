import type { Detective } from "../types/detective";

export const detectives = [
  { id: "kabitektif", name: "KABITEKTIF", image: "/mascot/mascot-jacket.webp", avatarId: "kabitektif-default", role: "SI TENANG", description: "Topi deerstalker, insting tajam.", accent: "red" },
  { id: "kabirius", name: "KABIRIUS", image: "/mascot/mascot-detective.webp", avatarId: "kabirius-default", role: "SI MISTERIUS", description: "Bergerak saat kota tertidur.", accent: "purple" },
  { id: "kabinter", name: "KABINTER", image: "/mascot/mascot-sweater.webp", avatarId: "kabinter-default", role: "SI TELITI", description: "Selalu duluan sampai di TKP.", accent: "blue" },
  { id: "kabiten", name: "KABITEN", image: "/mascot/mascot-cloak.webp", avatarId: "kabiten-default", role: "SI CEPAT", description: "Tidak ada detail yang lolos.", accent: "orange" },
] as const satisfies readonly Detective[];
