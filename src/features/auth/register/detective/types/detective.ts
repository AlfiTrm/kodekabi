export type DetectiveAccent = "red" | "purple" | "blue" | "orange";

export type Detective = {
  id: string;
  name: string;
  image: string;
  avatarId: string;
  role: string;
  description: string;
  accent: DetectiveAccent;
};
