"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { defaultEquippedCosmetics } from "../profile/data/cosmetics";
import type { EquippedCosmetics } from "../profile/types/cosmetic";

type RegisterDraft = {
  email: string;
  detectiveId: string;
  nickname: string;
  cosmetics: EquippedCosmetics;
};

type RegisterSessionValue = {
  draft: RegisterDraft;
  updateDraft: (next: Partial<RegisterDraft>) => void;
  updateCosmetics: (next: Partial<EquippedCosmetics>) => void;
};

const initialDraft: RegisterDraft = {
  email: "",
  detectiveId: "kabitektif",
  nickname: "NadiaJelita",
  cosmetics: defaultEquippedCosmetics,
};

const RegisterSessionContext = createContext<RegisterSessionValue | null>(null);

export function RegisterSessionProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<RegisterDraft>(initialDraft);

  function updateDraft(next: Partial<RegisterDraft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function updateCosmetics(next: Partial<EquippedCosmetics>) {
    setDraft((current) => ({ ...current, cosmetics: { ...current.cosmetics, ...next } }));
  }

  return (
    <RegisterSessionContext value={{ draft, updateDraft, updateCosmetics }}>
      {children}
    </RegisterSessionContext>
  );
}

export function useRegisterSession() {
  const session = useContext(RegisterSessionContext);
  if (!session) throw new Error("useRegisterSession must be used inside RegisterSessionProvider");
  return session;
}
