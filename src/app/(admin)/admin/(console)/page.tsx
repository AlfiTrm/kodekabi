import { AdminPageHeader } from "@/src/features/admin/_shared/components/admin-page-header";

const summary = [
  { label: "Total pemain", value: "2.847", change: "▲ +12%", tone: "text-green" },
  { label: "Case published", value: "24", change: "stabil", tone: "text-green" },
  { label: "Saldo koin beredar", value: "1.2M", change: "▲ +5%", tone: "text-green" },
  { label: "Moderasi pending", value: "7", change: "kritis", tone: "text-orange" },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Dashboard" description="Selamat datang, Admin Raka." />
      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <article key={item.label} className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-mono text-[8px] uppercase text-foreground/40">{item.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3"><strong className="font-display text-2xl font-semibold">{item.value}</strong><span className={`font-mono text-[9px] ${item.tone}`}>{item.change}</span></div>
          </article>
        ))}
      </section>
      <section className="mt-5 min-h-72 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold uppercase">Aktivitas terkini<span className="text-red">.</span></h2>
        <p className="mt-3 text-xs text-foreground/40">Aktivitas operasional akan dimuat dari API dashboard.</p>
      </section>
    </div>
  );
}
