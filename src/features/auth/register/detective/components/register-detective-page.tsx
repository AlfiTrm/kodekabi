"use client";

import Link from "next/link";

import { AuthHeader } from "../../../_shared/components/auth-header";
import { detectives } from "../data/detectives";
import { useRegisterDetective } from "../hooks/use-register-detective";
import { DetectivePanel } from "./detective-panel";

type RegisterDetectivePageProps = {
  avatarIds: Record<string, string>;
  initialDetectiveId?: string;
  completed?: boolean;
};

export function RegisterDetectivePage({ avatarIds, initialDetectiveId = "kabitektif", completed = false }: RegisterDetectivePageProps) {
  const { state, action, pending, selectedId, previewedId, setPreviewedId, select } = useRegisterDetective(initialDetectiveId);
  const selectedAvatarId = avatarIds[selectedId];

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
            const selected = selectedId === detective.id;
            const previewed = previewedId === detective.id || (previewedId === null && selected);
            const available = Boolean(avatarIds[detective.id]);
            return (
              <div key={detective.id} className={`flex min-w-0 flex-1 ${available ? "" : "pointer-events-none opacity-30"}`}>
                <DetectivePanel
                  detective={detective}
                  priority={index === 0}
                  selected={selected}
                  previewed={previewed}
                  onPreview={(active) => setPreviewedId(active ? detective.id : null)}
                  onSelect={() => select(detective.id, detective.avatarId)}
                />
              </div>
            );
          })}
        </div>

        <div className="z-20 mx-auto my-6 sm:absolute sm:bottom-6 sm:left-1/2 sm:my-0 sm:-translate-x-1/2">
          {completed && selectedId === initialDetectiveId ? (
            <Link href="/register/profile" className="inline-flex h-11 min-w-36 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-button-ink shadow-[0_5px_0_rgba(15,17,24,0.28)] transition-colors hover:bg-orange">Lanjut -&gt;</Link>
          ) : (
            <form action={action}>
              <input type="hidden" name="avatar_id" value={selectedAvatarId ?? ""} />
              {state.error ? <p role="alert" className="mb-3 rounded-xl border border-red/35 bg-background/90 px-3 py-2 text-[10px] text-red">{state.error}</p> : null}
              <button type="submit" disabled={!selectedAvatarId || pending} className="h-11 min-w-36 cursor-pointer rounded-full bg-white px-8 text-sm font-semibold text-button-ink shadow-[0_5px_0_rgba(15,17,24,0.28)] transition-colors enabled:hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/45">{pending ? "Menyimpan..." : "Lanjut ->"}</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
