"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { MissingFileStamp } from "./missing-file-stamp";

export function NotFoundPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="relative grid h-dvh place-items-center overflow-hidden bg-evidence-desk px-4 text-foreground sm:px-7">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[72%] h-px bg-black/55 shadow-[0_1px_0_rgba(255,255,255,0.025)]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-[7%] top-[18%] h-px w-44 rotate-[-7deg] bg-foreground/5" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[9%] top-[62%] h-px w-64 rotate-[4deg] bg-foreground/4" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[18%] left-[18%] h-px w-32 rotate-[11deg] bg-black/35" />

      <div aria-hidden="true" className="pointer-events-none absolute -left-14 top-16 z-0 hidden h-44 w-60 rotate-[8deg] bg-evidence-paper/60 p-5 text-evidence-ink shadow-[5px_6px_0_rgba(0,0,0,0.28)] sm:block">
        <span className="absolute -right-3 top-7 h-16 w-7 rotate-[3deg] bg-evidence-tape/70" />
        <p className="font-mono text-[8px] uppercase text-evidence-faded">Catatan penerimaan</p>
        <span className="mt-5 block h-px w-36 bg-evidence-ink/25" />
        <span className="mt-4 block h-px w-28 bg-evidence-ink/20" />
        <span className="mt-4 block h-px w-32 bg-evidence-ink/20" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-[14%] z-0 hidden h-56 w-64 rotate-[-7deg] border border-evidence-ink/30 bg-evidence-paper/70 p-5 text-evidence-ink shadow-[-5px_6px_0_rgba(0,0,0,0.3)] sm:block">
        <p className="font-mono text-[8px] text-evidence-faded">ARSIP / RAK B-09</p>
        <p className="mt-2 font-display text-lg font-medium">Daftar barang masuk</p>
        <div className="mt-4 grid grid-cols-[0.35fr_1fr] border-y border-evidence-ink/30 font-mono text-[7px]">
          <span className="border-r border-evidence-ink/30 p-2">397</span><span className="p-2">diterima</span>
          <span className="border-r border-t border-evidence-ink/30 p-2">398</span><span className="border-t border-evidence-ink/30 p-2">diterima</span>
          <span className="border-r border-t border-evidence-ink/30 p-2 text-evidence-stamp">404</span><span className="border-t border-evidence-ink/30 p-2 text-evidence-stamp">kosong</span>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -right-10 bottom-7 z-0 hidden h-36 w-72 rotate-[5deg] bg-orange-shadow/80 p-6 text-evidence-ink shadow-[-5px_5px_0_rgba(0,0,0,0.32)] sm:block [clip-path:polygon(0_8%,34%_8%,39%_0,100%_0,98%_100%,2%_96%)]">
        <p className="mt-4 font-mono text-[8px]">KOTA NUSA · PENYIMPANAN SEMENTARA</p>
        <span className="mt-3 block w-36 border-b border-evidence-ink/35" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute bottom-2 -left-8 z-0 h-40 w-56 rotate-[-10deg] bg-evidence-paper/75 p-5 text-evidence-ink shadow-[4px_5px_0_rgba(0,0,0,0.3)] sm:bottom-7">
        <span className="absolute right-5 top-5 size-5 rounded-full border-[5px] border-evidence-desk bg-evidence-desk" />
        <p className="font-mono text-[8px] text-evidence-faded">Evidence intake</p>
        <p className="mt-2 font-display text-xl font-medium">Item 404</p>
        <span className="mt-4 block h-px w-28 bg-evidence-ink/35" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 bottom-10 hidden h-7 border-t border-evidence-ruler/45 text-evidence-ruler/55 sm:flex sm:items-start sm:justify-between">
        {Array.from({ length: 31 }, (_, index) => (
          <span key={index} className={`relative block w-px bg-evidence-ruler/50 ${index % 5 === 0 ? "h-4" : index % 2 === 0 ? "h-2.5" : "h-1.5"}`}>
            {index % 5 === 0 ? <span className="absolute left-1 top-3 font-mono text-[7px]">{index}</span> : null}
          </span>
        ))}
      </div>

      <section className="relative w-full max-w-[820px] origin-center -translate-y-14 scale-[0.9] pb-16 pt-14 sm:-translate-y-20 sm:scale-[0.84] sm:pt-20">
        <div className="absolute right-6 top-28 z-30 rotate-[5deg] bg-evidence-paper p-2 pb-8 shadow-[5px_7px_0_rgba(0,0,0,0.38)] sm:right-10 sm:top-32 sm:p-3 sm:pb-10">
          <Image src="/mascot/mascot-detective.webp" alt="Foto Kabitektif" width={180} height={210} priority className="h-28 w-24 bg-surface-muted object-contain grayscale-[0.22] sm:h-40 sm:w-32" />
          <span className="absolute -top-3 left-1/2 h-8 w-14 -translate-x-1/2 rotate-[-4deg] bg-evidence-tape/80" />
          <span className="absolute bottom-2 left-3 font-mono text-[7px] text-evidence-faded sm:text-[8px]">lampiran foto / tidak terindeks</span>
        </div>

        <div className="relative z-10 mr-8 sm:mr-20">
          <div className="absolute -inset-x-3 -bottom-4 top-9 rotate-[-1deg] bg-orange-shadow shadow-[7px_8px_0_rgba(0,0,0,0.4)] [clip-path:polygon(0_0,39%_0,43%_7%,100%_7%,99%_100%,3%_98%)]" />

          <article className="relative animate-[evidence-sheet-in_560ms_cubic-bezier(0.16,1,0.3,1)_both] rotate-[0.65deg] bg-evidence-paper px-5 pb-8 pt-7 text-evidence-ink shadow-[4px_5px_0_rgba(0,0,0,0.3)] [clip-path:polygon(0_0,99%_1%,100%_95%,96%_98%,82%_97%,66%_100%,49%_98%,31%_100%,15%_98%,1%_100%)] sm:px-9 sm:pb-10 sm:pt-9">
            <span aria-hidden="true" className="absolute -top-3 left-[17%] h-10 w-20 rotate-[-6deg] bg-evidence-tape/75" />
            <span aria-hidden="true" className="absolute left-3 top-3 size-2 rounded-full bg-evidence-ink/70 shadow-[1px_1px_0_rgba(255,255,255,0.35)]" />

            <header className="border-b-2 border-evidence-ink/70 pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[9px] text-evidence-faded">Kota Nusa / Unit arsip digital</p>
                  <p className="mt-0.5 font-display text-lg font-medium">Formulir perpindahan barang bukti</p>
                </div>
                <p className="font-mono text-[9px] text-evidence-faded">lembar 1 dari —</p>
              </div>
            </header>

            <div className="grid border-b border-evidence-ink/35 sm:grid-cols-[1fr_0.55fr_0.55fr]">
              <Field label="Nomor kasus" value="KN-00-404" />
              <Field label="Nomor barang" value="404" bordered />
              <Field label="Tanggal diterima" value="—" bordered />
            </div>

            <div className="grid border-b border-evidence-ink/35 sm:grid-cols-2">
              <Field label="Jenis barang" value="Halaman web" />
              <Field label="Ditemukan di" value={pathname} bordered />
            </div>

            <div className="grid border-b border-evidence-ink/35 sm:grid-cols-2">
              <Field label="Dikumpulkan oleh" value="tidak tercatat" struck />
              <Field label="Kondisi saat diterima" value="tidak pernah diterima" bordered />
            </div>

            <div className="relative py-6 sm:py-7">
              <h1 className="max-w-[16ch] text-balance font-display text-3xl font-medium leading-tight tracking-[-0.025em] sm:text-4xl">Berkas ini tidak pernah sampai.</h1>
              <p className="mt-3 max-w-[62ch] text-pretty font-mono text-[10px] leading-5 text-evidence-faded sm:text-xs sm:leading-6">Alamat yang diminta tercatat, tetapi tidak ada dokumen yang cocok di indeks. Catatan perpindahannya berhenti sebelum barang bukti masuk ke arsip.</p>
              <span className="absolute right-1 top-5 hidden rotate-[4deg] font-display text-sm italic text-evidence-stamp/75 sm:block">cek rak lama?</span>
            </div>

            <section aria-label="Riwayat perpindahan barang bukti" className="border border-evidence-ink/55 font-mono text-[8px] sm:text-[9px]">
              <div className="grid grid-cols-[0.65fr_1fr_1fr_1.2fr] border-b border-evidence-ink/50 bg-evidence-ink/8 text-evidence-faded">
                <Cell>Waktu</Cell><Cell bordered>Diserahkan oleh</Cell><Cell bordered>Diterima oleh</Cell><Cell bordered>Catatan</Cell>
              </div>
              <div className="grid min-h-12 grid-cols-[0.65fr_1fr_1fr_1.2fr]">
                <Cell>—</Cell><Cell bordered>—</Cell><Cell bordered>—</Cell><Cell bordered><span className="relative inline-block text-evidence-stamp">rantai bukti terputus<span className="absolute -inset-x-1 top-1/2 h-px rotate-[-2deg] bg-evidence-stamp/70" /></span></Cell>
              </div>
            </section>

            <div className="mt-5 flex items-end justify-between gap-4 font-mono text-[8px] text-evidence-faded">
              <p>Paraf petugas: <span className="ml-2 inline-block w-20 border-b border-evidence-ink/50" /></p>
              <p className="rotate-[-2deg] font-display text-sm italic text-evidence-ink/65">tidak ada jejak lanjutan</p>
            </div>

            <div className="absolute bottom-24 right-3 rotate-[-8deg] animate-[not-found-stamp_520ms_cubic-bezier(0.16,1,0.3,1)_250ms_both] text-evidence-stamp opacity-90 sm:bottom-20 sm:right-8">
              <MissingFileStamp />
            </div>

            <div className="mt-7 flex justify-center border-t border-evidence-ink/25 pt-5">
              <button type="button" onClick={() => router.back()} className="inline-flex h-10 min-w-36 items-center justify-center rounded-full bg-evidence-ink px-8 text-xs font-semibold text-evidence-paper transition-colors duration-200 hover:bg-evidence-stamp">Kembali</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  bordered?: boolean;
  struck?: boolean;
};

function Field({ label, value, bordered = false, struck = false }: FieldProps) {
  return (
    <div className={`min-w-0 px-3 py-3 ${bordered ? "border-t border-evidence-ink/35 sm:border-l sm:border-t-0" : ""}`}>
      <p className="font-mono text-[7px] text-evidence-faded sm:text-[8px]">{label}</p>
      <p className={`mt-1 truncate font-mono text-[10px] sm:text-xs ${struck ? "line-through decoration-evidence-stamp decoration-2" : ""}`}>{value}</p>
    </div>
  );
}

function Cell({ children, bordered = false }: { children: ReactNode; bordered?: boolean }) {
  return <div className={`min-w-0 px-2 py-2.5 sm:px-3 ${bordered ? "border-l border-evidence-ink/40" : ""}`}>{children}</div>;
}
