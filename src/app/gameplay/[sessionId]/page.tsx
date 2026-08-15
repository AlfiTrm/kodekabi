import { GameplaySessionPage } from "@/src/features/main-site/gameplay/containers/gameplay-session-page";

type GameplayRouteProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function GameplayRoute({ params }: GameplayRouteProps) {
  const { sessionId } = await params;
  return <GameplaySessionPage sessionId={sessionId} />;
}
