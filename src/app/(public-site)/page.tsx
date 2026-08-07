import { HomeHero } from "@/src/features/public-site/home/components/home-hero";
import { CaseCardStack } from "@/src/features/public-site/home/components/case-card-stack";
import { HomeOverview } from "@/src/features/public-site/home/components/home-overview";
import { homeCaseCards } from "@/src/features/public-site/home/data/case-cards";

export default function PublicHomePage() {
  return (
    <main className="flex-1">
      <HomeHero />
      <CaseCardStack cards={homeCaseCards} />
      <HomeOverview />
    </main>
  );
}
