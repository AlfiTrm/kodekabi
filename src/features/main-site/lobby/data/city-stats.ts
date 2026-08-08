import type { CityStat } from "../types/city-stat";

export const cityStats: CityStat[] = [
  { id: "information-health", label: "Info Health", value: 70, delta: "▼ -8", tone: "red" },
  { id: "public-trust", label: "Trust", value: 72, delta: "▲ +3", tone: "green" },
  { id: "social-stability", label: "Stability", value: 80, delta: "stabil", tone: "green" },
  { id: "public-wellbeing", label: "Wellbeing", value: 44, delta: "kritis!", tone: "red" },
];

