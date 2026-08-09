export type LobbyCaseTone = "blue" | "green" | "orange" | "locked";

export type LobbyCase = {
  id: string;
  eyebrow: string;
  title: string;
  xp: number;
  tone: LobbyCaseTone;
  locked?: boolean;
};

