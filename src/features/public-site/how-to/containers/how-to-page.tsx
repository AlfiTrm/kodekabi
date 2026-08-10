import { SiteContainer } from "@/src/shared/components/layout/site-container";
import { Button } from "@/src/shared/components/ui/button";

const faqs = [
  ["Gratis beneran?", "Iya, semua kasus Season 1 gratis. Koin cuma untuk kosmetik."],
  ["Kalau jawabanku salah?", "Kota kena dampak kecil, tetapi kamu bisa main ulang dan tetap mendapat XP proses berpikir."],
  ["Siapa yang menilai jawabanku?", "Sistem transparan menjelaskan skor dan alasan, bukan sekadar memberi angka."],
  ["Perlu instal?", "Tidak. Jalankan langsung dari browser di ponsel atau laptop."],
] as const;

export function HowToPage() {
  return (
    <main className="flex-1 overflow-hidden bg-background pb-20">
      <SiteContainer className="pt-10 sm:pt-14 lg:pt-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[10px] text-foreground/45">Dari nol sampai jadi auditor</p>
          <h1 className="mt-3 text-balance font-display text-5xl font-bold leading-none tracking-[-0.035em] sm:text-7xl">
            Cara <span className="text-purple">main.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-6 text-foreground/60 sm:text-base">
            Satu kasus butuh sekitar 10 menit. Tidak ada jawaban di buku, semua ada di bukti.
          </p>
        </header>

        <div className="mx-auto mt-16 max-w-6xl space-y-14 sm:mt-20 sm:space-y-20">
          <section className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <StepCopy step="Langkah 01" tone="red" title={<>Pilih kasus harianmu.</>}>
              Setiap hari Kota Nusa punya masalah baru: unggahan viral mencurigakan, chatbot yang terlalu percaya diri, sampai statistik yang diplintir. Pilih satu, baca briefing-nya, lalu pasang tekanan awalmu.
            </StepCopy>
            <div className="rotate-[2deg] rounded-2xl bg-red p-6 text-button-ink shadow-[8px_9px_0_var(--red-shadow)] sm:p-8">
              <div className="flex items-center justify-between font-mono text-[9px] font-semibold">
                <span>DAILY CASE · SOCIAL POST</span><span className="rounded-full bg-black/15 px-3 py-1">2× XP</span>
              </div>
              <h2 className="mt-5 max-w-sm font-display text-3xl font-bold uppercase leading-[0.9] tracking-[-0.035em] sm:text-5xl">Vitamin<br />ajaib viral.</h2>
              <p className="mt-4 max-w-md text-xs leading-5 text-button-ink/70">Klaim “sembuh 27 penyakit” menyebar 3.100× dalam sehari.</p>
              <span className="mt-7 inline-flex rounded-full bg-white px-5 py-2 text-xs font-bold">▶ Main</span>
            </div>
          </section>

          <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <InvestigationPanel />
            <StepCopy step="Langkah 02" tone="purple" title={<>Kumpulkan bukti, uji keyakinanmu.</>}>
              Buka bukti satu per satu, interogasi karakter yang terlibat, lalu geser tingkat keyakinan tiap kali menemukan hal baru. Tidak ada jawaban instan. Yang dinilai adalah caramu berpikir.
            </StepCopy>
          </section>

          <section className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <StepCopy step="Langkah 03" tone="green" title={<>Putuskan, dan lihat kotanya berubah.</>}>
              Vonis kasusmu menentukan arah kota. Keputusanmu langsung berdampak ke Kota Nusa: kesehatan informasi naik, reputasimu bertambah, dan kasus baru mulai terbuka.
            </StepCopy>
            <div className="-rotate-[1.5deg] rounded-2xl bg-green p-7 text-button-ink shadow-[7px_8px_0_var(--green-shadow)] sm:p-9">
              <p className="font-mono text-[9px]">HASIL KASUS #03</p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[-0.03em] sm:text-4xl">Kasus terpecahkan.</h2>
              <div className="mt-5 flex flex-wrap gap-2 text-[9px] font-bold">
                {["+240 XP", "+80 koin", "Info health +4", "Trust +2"].map((item) => <span key={item} className="rounded-full bg-white/75 px-3 py-1.5">{item}</span>)}
              </div>
              <p className="mt-4 text-xs text-button-ink/65">Klarifikasimu dimuat papan informasi kota. Warga berhenti panik.</p>
            </div>
          </section>
        </div>

        <section className="mx-auto mt-20 max-w-6xl sm:mt-28">
          <h2 className="text-center font-display text-2xl font-bold uppercase tracking-[-0.025em] sm:text-3xl">Sering ditanya.</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <article key={question} className="rounded-xl bg-surface px-5 py-4 ring-1 ring-white/8">
                <h3 className="text-sm font-bold">{question}</h3>
                <p className="mt-2 text-xs leading-5 text-foreground/55">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl border-t border-white/10 pt-12 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-[-0.03em] sm:text-4xl">Siap jadi auditor<span className="text-red">?</span></h2>
          <Button href="/register" variant="solid" className="mt-6">▶ Main Sekarang</Button>
        </section>
      </SiteContainer>
    </main>
  );
}

type StepCopyProps = { step: string; tone: "red" | "purple" | "green"; title: React.ReactNode; children: React.ReactNode };

function StepCopy({ step, tone, title, children }: StepCopyProps) {
  const tones = { red: "bg-red", purple: "bg-purple", green: "bg-green" };
  return (
    <div>
      <span className={`inline-flex rounded-full px-3 py-1.5 font-mono text-[9px] font-bold text-button-ink ${tones[tone]}`}>{step}</span>
      <h2 className="mt-4 text-balance font-display text-3xl font-bold uppercase leading-[0.95] tracking-[-0.035em] sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-foreground/60">{children}</p>
    </div>
  );
}

function InvestigationPanel() {
  return (
    <div className="rotate-[-2deg] rounded-2xl bg-surface p-5 shadow-[7px_8px_0_rgba(0,0,0,0.35)] ring-1 ring-white/10 sm:p-7">
      <p className="font-mono text-[9px] text-foreground/45">PAPAN BUKTI · 3/5 DIBUKA</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-[9px] font-bold">
        <span className="rounded-lg border border-red bg-red/10 p-3 text-red">Postingan asli<br /><small className="text-green">✓ DIBUKA</small></span>
        <span className="rounded-lg bg-background p-3">Profil sumber<br /><small className="text-green">✓ DIBUKA</small></span>
        <span className="rounded-lg bg-background p-3 text-foreground/40">Rilis BPOM<br /><small>🔒 BELUM</small></span>
      </div>
      <div className="mt-5 flex items-center justify-between text-[10px]"><span>Seberapa yakin kamu?</span><strong className="text-purple">46%</strong></div>
      <div className="relative mt-2 h-2 rounded-full bg-background"><span className="block h-full w-[46%] rounded-full bg-purple" /><span className="absolute left-[46%] top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-purple shadow-md" /></div>
      <p className="mt-4 text-[9px] text-foreground/40">Geser keyakinan setelah tiap bukti baru. Tidak dinilai dari bagus.</p>
    </div>
  );
}
