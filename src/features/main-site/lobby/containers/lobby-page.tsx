import { LobbyHero } from "../components/lobby-hero";
import { LobbyCaseSection } from "../components/lobby-case-section";

export function LobbyPage() {
  return (
    <main className="flex-1 bg-background">
      <LobbyHero />
      <LobbyCaseSection />
    </main>
  );
}
