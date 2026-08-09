import type { LobbyCase } from "../types/lobby-case";

export const lobbyCases: LobbyCase[] = [
  { id: "forum-rt-12", eyebrow: "Forum · Baru", title: "Thread Forum RT 12", xp: 120, tone: "blue" },
  { id: "angka-konteks", eyebrow: "Artikel · Baru", title: "Angka di Luar Konteks", xp: 110, tone: "green" },
  { id: "grafik-bohong", eyebrow: "Statistik · Baru", title: "Grafik yang Bohong", xp: 110, tone: "orange" },
  { id: "pengumuman-palsu", eyebrow: "Pengumuman · Terkunci", title: "Pengumuman Palsu?", xp: 0, tone: "locked", locked: true },
];

