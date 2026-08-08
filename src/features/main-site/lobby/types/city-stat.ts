export type CityStatTone = "red" | "green";

export type CityStat = {
  id: string;
  label: string;
  value: number;
  delta: string;
  tone: CityStatTone;
};

