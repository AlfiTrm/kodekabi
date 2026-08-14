"use client";

import { AuthHeader } from "../../../_shared/components/auth-header";
import { AuthInput } from "../../../_shared/components/auth-input";
import { detectives } from "../../detective/data/detectives";
import { banners, titles } from "../data/cosmetics";
import { initialPlayerStats } from "../data/initial-player-stats";
import { useRegisterProfile } from "../hooks/use-register-profile";
import { IdentityPreview } from "./identity-preview";
import { TitleSelector } from "./title-selector";

export function RegisterProfilePage({ initialDetectiveId = "kabitektif" }: { initialDetectiveId?: string }) {
  const { draft, state, action, pending, previewTitleId, setPreviewTitleId, setNickname, randomizeNickname, selectTitle } = useRegisterProfile(initialDetectiveId);
  const selectedTitle = titles.find((title) => title.id === draft.cosmetics.titleId) ?? titles[0];
  const visibleTitle = titles.find((title) => title.id === previewTitleId) ?? selectedTitle;
  const selectedDetective = detectives.find((detective) => detective.id === draft.detectiveId) ?? detectives[0];
  const selectedBanner = banners.find((banner) => banner.id === draft.cosmetics.bannerId) ?? banners[0];
  const validNickname = /^[A-Za-z0-9._]{3,16}$/.test(draft.nickname);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthHeader currentStep={3} backHref="/register/detective" />
      <form action={action} className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 sm:px-10 lg:grid-cols-2 lg:pt-24">
        <section>
          <h1 className="max-w-lg text-balance font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-5xl">Siapa namamu di kota Nusa<span className="text-purple">?</span></h1>
          <p className="mt-3 text-xs text-foreground/55">Nickname tampil di peringkat dan papan kota.</p>

          <div className="mt-8 max-w-md">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1"><AuthInput name="username" label="Nickname" value={draft.nickname} onChange={(event) => setNickname(event.target.value)} status={validNickname ? "tersedia" : undefined} invalid={draft.nickname.length > 0 && !validNickname} maxLength={16} hint="3 sampai 16 karakter. Huruf, angka, titik, garis bawah." required /></div>
              <button type="button" aria-label="Acak username" title="Acak username" onClick={randomizeNickname} className="mt-6 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border-strong bg-surface text-lg text-foreground transition-[border-color,background-color,transform] hover:-rotate-12 hover:border-purple hover:bg-surface-elevated active:rotate-12">⚄</button>
            </div>
          </div>

          <div className="mt-5 max-w-lg">
            <p className="mb-2 text-xs font-semibold">Gelar pembuka <span className="font-normal text-foreground/45">(gelar lain terbuka lewat pencapaian)</span></p>
            <TitleSelector titles={titles} selectedId={draft.cosmetics.titleId} previewId={previewTitleId} onPreview={setPreviewTitleId} onSelect={selectTitle} />
          </div>

          <input type="hidden" name="title" value={selectedTitle.label} />
          {state.error ? <p role="alert" className="mt-5 rounded-xl border border-red/35 bg-red/10 px-3 py-2 text-[10px] text-red">{state.error}</p> : null}
          <button type="submit" disabled={!validNickname || pending} className="mt-7 h-11 cursor-pointer rounded-full bg-white px-8 text-sm font-semibold text-button-ink transition-colors enabled:hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/45">{pending ? "Menyiapkan Kota Nusa..." : "Masuk ke Kota Nusa ->"}</button>
        </section>
        <IdentityPreview nickname={draft.nickname} detective={selectedDetective} title={visibleTitle} banner={selectedBanner} stats={initialPlayerStats} />
      </form>
    </main>
  );
}
