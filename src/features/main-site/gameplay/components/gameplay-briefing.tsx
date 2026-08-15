import Link from "next/link";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
import type { GameplayCase, GameplaySession } from "../types/gameplay";
import { InitialAssessmentCard } from "./initial-assessment-card";

const difficultyLabels: Record<string, string> = { low: "Mudah", medium: "Sedang", high: "Sulit" };

export function GameplayBriefing({ caseItem, session }: { caseItem: GameplayCase; session: GameplaySession }) {
  const imageUrl = getTrustedImageUrl(caseItem.thumbnail_url);
  const difficulty = difficultyLabels[caseItem.difficulty_level] ?? caseItem.difficulty_level;

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:py-14">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-red/55 bg-surface-muted shadow-[12px_14px_0_rgba(242,109,109,0.12)] lg:rotate-[-2deg]">
        {imageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(imageUrl)})` }} /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-red-shadow/85 via-red-shadow/20 to-background/10" />
        <div className="absolute inset-x-6 bottom-6">
          <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.08em] text-white/75">
            <span className="rounded-full bg-background/55 px-3 py-1 backdrop-blur-sm">Case file</span>
            <span className="rounded-full bg-background/55 px-3 py-1 backdrop-blur-sm">{caseItem.estimated_duration_minutes} menit</span>
          </div>
          <p className="mt-4 max-w-[14ch] font-display text-4xl font-bold uppercase leading-[0.9] sm:text-5xl">{caseItem.title}<span className="text-red">.</span></p>
        </div>
      </div>

      <section className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-foreground/40">Case briefing · {difficulty}</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl">{caseItem.title}<span className="text-red">.</span></h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/60 sm:text-base">{caseItem.short_description}</p>

        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.08em]">
          <span className="rounded-full bg-blue/12 px-3 py-2 text-blue">Skill: evidence</span>
          <span className="rounded-full bg-purple/12 px-3 py-2 text-purple">Skill: confidence</span>
          <span className="rounded-full bg-orange/12 px-3 py-2 text-orange">Taruhan: wellbeing kota</span>
        </div>

        <div className="mt-7 max-w-2xl">
          <InitialAssessmentCard initialAssessment={session.initial_assessment} initialConfidence={session.initial_confidence} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button type="button" className="inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-bold text-button-ink shadow-[0_10px_28px_rgba(255,255,255,0.12)] transition-transform hover:-translate-y-1">
            Mulai Investigasi
          </button>
          <span className="font-mono text-[9px] text-foreground/35">Progress tersimpan otomatis</span>
        </div>
        <Link href="/cases" className="mt-7 inline-block text-xs text-foreground/45 underline-offset-4 hover:text-foreground hover:underline lg:hidden">Kembali ke daftar kasus</Link>
      </section>
    </main>
  );
}
