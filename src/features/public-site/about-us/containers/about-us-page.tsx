import Image from "next/image";

import { SiteContainer } from "@/src/shared/components/layout/site-container";
import { Button } from "@/src/shared/components/ui/button";

const principles = [
  { title: "Proses di atas jawaban", copy: "Skor kami menilai caramu berpikir: bukti yang kamu buka, keyakinan yang kamu ubah, dan alasan yang kamu tulis.", color: "bg-red", shadow: "shadow-[6px_7px_0_var(--red-shadow)]" },
  { title: "Aman dan transparan", copy: "Tanpa data pribadi berlebihan dan tanpa skor misterius. Semua penilaian bisa dijelaskan.", color: "bg-blue", shadow: "shadow-[6px_7px_0_#315f9d]" },
  { title: "Seru dulu", copy: "Kalau tidak seru, tidak akan dimainkan. KODEKABI didesain sebagai game beneran, bukan kuis sekolah berkostum game.", color: "bg-green", shadow: "shadow-[6px_7px_0_var(--green-shadow)]" },
] as const;

export function AboutUsPage() {
  return (
    <main className="flex-1 overflow-hidden bg-background pb-20">
      <SiteContainer className="pt-10 sm:pt-14 lg:pt-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="font-mono text-[10px] text-foreground/45">Kenapa kami bikin ini</p>
            <h1 className="mt-4 max-w-[13ch] text-balance font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.035em] sm:text-7xl">
              Hoaks itu game. Sayangnya cuma <span className="text-purple">satu pihak yang main.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-sm leading-7 text-foreground/60 sm:text-base">
              Penyebar informasi palsu sudah lama memperlakukan internet seperti arena permainan. KODEKABI membalik meja: sekarang giliran pemainnya yang berburu. Kami percaya kemampuan membaca informasi bukan pelajaran hafalan, tetapi keterampilan yang paling cepat dikuasai lewat pengalaman langsung.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md pb-5">
            <div className="absolute -left-5 top-8 z-10 rotate-[-4deg] rounded-full bg-surface px-4 py-2 text-xs font-bold shadow-[4px_5px_0_rgba(0,0,0,0.35)]">Halo, aku Kabi!</div>
            <div className="relative ml-auto aspect-[4/3] w-[88%] rotate-[3deg] overflow-hidden rounded-3xl bg-purple shadow-[9px_10px_0_var(--purple-shadow)]">
              <Image src="/mascot/mascot-jacket.webp" alt="Kabi, mentor detektif Kota Nusa" fill priority sizes="(max-width: 1024px) 80vw, 420px" className="translate-y-[8%] scale-[1.18] object-contain object-bottom" />
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3 sm:mt-24">
          {principles.map((principle) => (
            <article key={principle.title} className={`rounded-2xl p-6 text-button-ink ${principle.color} ${principle.shadow} sm:p-7`}>
              <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-[-0.025em]">{principle.title}</h2>
              <p className="mt-4 text-sm leading-6 text-button-ink/70">{principle.copy}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 sm:mt-28">
          <header className="text-center">
            <h2 className="font-display text-3xl font-bold uppercase tracking-[-0.03em] sm:text-5xl"><span className="text-orange">Kota Nusa</span> dan penjaganya<span className="text-green">.</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-6 text-foreground/55">Kota fiksi tempat semua kasus terjadi. Warganya polos, informasinya liar, dan satu-satunya pertahanan adalah para Auditor sepertimu.</p>
          </header>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="flex items-center gap-5 rounded-2xl bg-surface p-5 ring-1 ring-white/8 sm:p-6">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-white sm:size-24"><Image src="/mascot/mascot-jacket-45.webp" alt="Kabi" fill sizes="96px" className="object-contain" /></div>
              <div><h3 className="font-display text-xl font-bold uppercase">Kabi</h3><p className="font-mono text-[9px] text-purple">KODEKABI · Kepala detektif</p><p className="mt-3 text-xs leading-5 text-foreground/55">Tenang di segala situasi, penuh kesabaran. Dia mentor pertamamu dan satu-satunya yang percaya kamu bisa.</p></div>
            </article>
            <article className="flex items-center gap-5 rounded-2xl bg-surface p-5 ring-1 ring-white/8 sm:p-6">
              <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-orange/8 font-display text-4xl font-bold text-orange/35 sm:size-24">?</div>
              <div><h3 className="font-display text-xl font-bold uppercase">Sang Penyebar</h3><p className="font-mono text-[9px] text-red">Identitas tidak diketahui</p><p className="mt-3 text-xs leading-5 text-foreground/55">Dalang di balik gelombang hoaks Kota Nusa. Jejaknya ada di setiap kasus, tetapi bentuk dan motifnya terus berubah.</p></div>
            </article>
          </div>
        </section>

        <section className="mt-16 flex flex-col gap-7 rounded-2xl bg-surface px-6 py-7 ring-1 ring-white/8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div><h2 className="font-display text-2xl font-bold uppercase tracking-[-0.025em]">Mau kolaborasi<span className="text-red">?</span></h2><p className="mt-2 text-sm text-foreground/50">Sekolah, komunitas, atau media yang ingin memakai KODEKABI, sapa kami.</p></div>
          <div className="flex flex-wrap items-center gap-3"><a href="mailto:halo@kodekabi.id" className="text-sm text-foreground/65 transition-colors hover:text-orange">halo@kodekabi.id</a><Button href="/register" variant="solid">Main Gratis</Button></div>
        </section>
      </SiteContainer>
    </main>
  );
}
