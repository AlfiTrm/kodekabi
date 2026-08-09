import Link from "next/link";

import { Button } from "@/src/shared/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-visible border-b border-border bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-70 [background-image:linear-gradient(135deg,transparent_44%,rgba(46,52,70,0.42)_45%,rgba(46,52,70,0.42)_52%,transparent_53%)] [background-size:15px_15px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />

      <div className="relative mx-auto flex min-h-[515px] max-w-[1390px] items-center justify-center px-6 py-20 sm:px-10 lg:px-16">
        <div className="flex max-w-5xl animate-[hero-copy-in_700ms_cubic-bezier(0.16,1,0.3,1)_both] flex-col items-center text-center motion-reduce:animate-none">
          <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.86] tracking-[-0.045em] text-foreground">
            <span className="block">BONGKAR<span className="text-red">.</span> SELIDIKI<span className="text-purple">.</span></span>
            <span className="mt-3 text-orange">SELAMATKAN <span className="text-foreground">KOTA</span><span className="text-green">.</span></span>
          </h1>

          <p className="mt-4 max-w-2xl text-[11px] leading-6 text-foreground/55 sm:text-xs">
            Game investigasi #1 untuk pemburu hoaks. Jadi Auditor Digital,
            bongkar informasi palsu, dan jaga Kota Nusa tetap waras.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              href="/lobby"
              variant="detective"
              tone="orange"
              hoverAsset={<span className="text-7xl leading-none">💼</span>}
              className="h-[60px] min-w-[238px] px-8 font-display text-xl"
            >
              <span>Main Sekarang</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
