import Image from "next/image";
import Link from "next/link";

export function ContinuationCaseCard() {
  return (
    <div className="grid gap-3">
      <article className="relative flex min-h-56 flex-col overflow-hidden rounded-[28px] bg-purple p-6 text-white shadow-[0_20px_60px_rgba(131,117,232,0.15)] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-button-ink/60">Lanjutan · Chatbot</p>
          <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-button-ink">62%</span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-none tracking-[-0.035em] sm:text-3xl">Chatbot Klinik 24 Jam</h2>
        <Link href="/cases" className="mt-7 inline-flex h-12 w-fit items-center gap-3 rounded-full bg-white px-7 text-xs font-bold text-button-ink transition-transform duration-200 hover:-translate-y-1">
          <span aria-hidden="true">▶</span>
          Lanjutkan
        </Link>
        <div className="mt-auto h-2 overflow-hidden rounded-full bg-purple-shadow/55">
          <span className="block h-full w-[62%] rounded-full bg-white" />
        </div>
      </article>

      <aside className="flex min-h-20 items-center gap-4 rounded-2xl border border-white/8 bg-surface px-4 py-3">
        <span className="flex size-12 shrink-0 items-end justify-center overflow-hidden rounded-xl bg-white">
          <Image src="/mascot/mascot-jacket.webp" alt="Kabitektif" width={52} height={52} className="h-12 w-auto object-contain" />
        </span>
        <p className="text-[10px] leading-relaxed text-foreground/65 sm:text-xs">
          “Wellbeing kota lagi kritis. Kasus vitamin itu prioritas, gas duluan!”
        </p>
      </aside>
    </div>
  );
}

