"use client";

import { useState } from "react";

import { Button } from "@/src/shared/components/ui/button";
import { AuthHeader } from "../../../_shared/components/auth-header";
import { AuthInput } from "../../../_shared/components/auth-input";
import { useRegisterSession } from "../../_shared/register-session-context";
import { detectives } from "../../detective/data/detectives";
import { banners, titles } from "../data/cosmetics";
import { initialPlayerStats } from "../data/initial-player-stats";
import { generateNickname } from "../utils/generate-nickname";
import { IdentityPreview } from "./identity-preview";
import { TitleSelector } from "./title-selector";

export function RegisterProfilePage() {
  const { draft, updateDraft, updateCosmetics } = useRegisterSession();
  const [previewTitleId, setPreviewTitleId] = useState<string | null>(null);

  const selectedTitle = titles.find((title) => title.id === draft.cosmetics.titleId) ?? titles[0];
  const visibleTitle = titles.find((title) => title.id === previewTitleId) ?? selectedTitle;
  const selectedDetective = detectives.find((detective) => detective.id === draft.detectiveId) ?? detectives[0];
  const selectedBanner = banners.find((banner) => banner.id === draft.cosmetics.bannerId) ?? banners[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthHeader currentStep={3} backHref="/register/detective" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 sm:px-10 lg:grid-cols-2 lg:pt-24">
        <section>
          <h1 className="max-w-lg text-balance font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-5xl">Siapa namamu di kota Nusa<span className="text-purple">?</span></h1>
          <p className="mt-3 text-xs text-foreground/55">Nickname tampil di peringkat dan papan kota.</p>

          <div className="mt-8 max-w-md">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <AuthInput label="Nickname" value={draft.nickname} onChange={(event) => updateDraft({ nickname: event.target.value })} status="tersedia" maxLength={16} hint="3 sampai 16 karakter. Huruf, angka, titik, garis bawah." />
              </div>
              <button type="button" aria-label="Acak username" title="Acak username" onClick={() => updateDraft({ nickname: generateNickname(draft.nickname) })} className="mt-6 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border-strong bg-surface text-lg text-foreground transition-[border-color,background-color,transform] hover:-rotate-12 hover:border-purple hover:bg-surface-elevated active:rotate-12">⚄</button>
            </div>
          </div>

          <div className="mt-5 max-w-lg">
            <p className="mb-2 text-xs font-semibold">Gelar pembuka <span className="font-normal text-foreground/45">(gelar lain terbuka lewat pencapaian)</span></p>
            <TitleSelector
              titles={titles}
              selectedId={draft.cosmetics.titleId}
              previewId={previewTitleId}
              onPreview={setPreviewTitleId}
              onSelect={(titleId) => {
                updateCosmetics({ titleId });
                setPreviewTitleId(null);
              }}
            />
          </div>

          <Button href="/lobby" variant="solid" className="mt-7">Masuk ke Kota Nusa -&gt;</Button>
        </section>

        <IdentityPreview nickname={draft.nickname} detective={selectedDetective} title={visibleTitle} banner={selectedBanner} stats={initialPlayerStats} />
      </div>
    </main>
  );
}
