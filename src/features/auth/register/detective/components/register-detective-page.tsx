"use client";

import { useState } from "react";

import { AuthHeader } from "../../../_shared/components/auth-header";
import { useRegisterSession } from "../../_shared/register-session-context";
import { Button } from "@/src/shared/components/ui/button";
import { detectives } from "../data/detectives";
import { DetectivePanel } from "./detective-panel";

export function RegisterDetectivePage() {
  const { draft, updateDraft, updateCosmetics } = useRegisterSession();
  const [previewedId, setPreviewedId] = useState<string | null>(null);

  return (
    <main className="flex min-h-svh flex-col overflow-x-hidden bg-background text-foreground">
      <AuthHeader currentStep={2} backHref="/register/verify" />

      <section className="relative flex min-h-0 flex-1 flex-col pt-8 text-center sm:pt-10">
        <div className="relative z-10 shrink-0 px-6">
          <h1 className="text-balance font-display text-4xl font-bold uppercase tracking-[-0.04em] sm:text-5xl">Pilih detektifmu<span className="text-red">.</span></h1>
          <p className="mt-2 text-sm text-foreground/60">Semua kemampuannya sama, ini soal gaya. Bisa diganti kapan saja.</p>
        </div>

        <div className="mt-7 flex w-full flex-col border-y border-border-strong sm:min-h-[520px] sm:flex-1 sm:flex-row" onMouseLeave={() => setPreviewedId(null)}>
          {detectives.map((detective, index) => {
            const selected = draft.detectiveId === detective.id;
            const previewed = previewedId === detective.id || (previewedId === null && selected);

            return (
              <DetectivePanel
                key={detective.id}
                detective={detective}
                priority={index === 0}
                selected={selected}
                previewed={previewed}
                onPreview={(active) => setPreviewedId(active ? detective.id : null)}
                onSelect={() => {
                  updateDraft({ detectiveId: detective.id });
                  updateCosmetics({ avatarId: detective.avatarId });
                }}
              />
            );
          })}
        </div>

        <Button href="/register/profile" variant="solid" className="z-20 mx-auto my-6 min-w-36 shadow-[0_5px_0_rgba(15,17,24,0.28)] sm:absolute sm:bottom-6 sm:left-1/2 sm:my-0 sm:-translate-x-1/2">Lanjut -&gt;</Button>
      </section>
    </main>
  );
}
