import { Button } from "@/src/shared/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Pilih Kasus",
    description: "Setiap hari ada kasus baru di Kota Nusa. Hoaks viral, chatbot halu, angka palsu.",
    color: "bg-red",
  },
  {
    number: "02",
    title: "Selidiki",
    description: "Buka bukti, interogasi karakter, dan tentukan seberapa yakin kamu.",
    color: "bg-purple",
  },
  {
    number: "03",
    title: "Lihat Dampaknya",
    description: "Keputusanmu mengubah kota. Naik level, kumpulkan reputasi, pecahkan rekor.",
    color: "bg-green",
  },
] as const;

const stats = [
  { value: "248K", suffix: "+", label: "kasus terpecahkan", color: "text-red" },
  { value: "36K", suffix: "+", label: "auditor terdaftar", color: "text-purple" },
  { value: "4.8", suffix: "★", label: "rating pemain", color: "text-green" },
  { value: "10", suffix: "mnt", label: "per kasus", color: "text-blue" },
] as const;

export function HomeOverview() {
  return (
    <section className="relative z-20 -mt-24 border-t border-border bg-background px-6 pb-24 pt-12 sm:-mt-40 sm:pt-16 lg:-mt-56">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-border bg-surface px-5 py-5"
            >
              <span className={`inline-flex size-7 items-center justify-center rounded-lg font-display text-sm font-bold text-foreground ${step.color}`}>
                {step.number}
              </span>
              <h2 className="mt-3 font-display text-base font-bold uppercase text-foreground">
                {step.title}
              </h2>
              <p className="mt-2 max-w-sm text-[10px] leading-relaxed text-foreground/60">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex min-h-[155px] flex-col justify-between gap-8 overflow-hidden rounded-2xl bg-purple px-8 py-7 text-foreground sm:flex-row sm:items-end sm:px-9">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-button-ink/70">
              Peringkat mingguan · season 1
            </p>
            <h2 className="mt-2 max-w-md font-display text-2xl font-bold uppercase leading-[0.9] tracking-[-0.06em] sm:text-3xl">
              36.000 auditor,
              <br />
              siapa paling jeli?
            </h2>
            <p className="mt-2 text-[10px] text-button-ink/70">
              Podium reset tiap Senin. Nama kamu bisa ada di sana minggu depan.
            </p>
          </div>

          <div className="flex items-end justify-between gap-3 sm:gap-4">
            <div className="flex h-20 w-12 items-end justify-center rounded-t-lg bg-foreground/25 pb-3 font-display text-lg font-bold text-foreground/90">2</div>
            <div className="flex h-28 w-14 items-end justify-center rounded-t-lg bg-foreground pb-3 font-display text-xl font-bold text-button-ink">1</div>
            <div className="flex h-16 w-12 items-end justify-center rounded-t-lg bg-foreground/25 pb-3 font-display text-lg font-bold text-foreground/90">3</div>
          </div>

          <Button href="/leaderboards" variant="solid" size="compact" className="shrink-0 self-start sm:self-center">
            Lihat Peringkat
          </Button>
        </div>

        <div className="mt-11 grid grid-cols-2 gap-y-8 sm:flex sm:items-start sm:justify-between sm:gap-y-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={
                index === 0
                  ? "text-left"
                  : index === stats.length - 1
                    ? "text-left sm:text-right"
                    : "text-left sm:text-center"
              }
            >
              <p className="font-display text-3xl font-bold leading-none text-foreground sm:text-4xl">
                {stat.value}
                <span className={stat.color}>{stat.suffix}</span>
              </p>
              <p className="mt-2 font-mono text-[9px] text-foreground/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
