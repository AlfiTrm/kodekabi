import Image from "next/image";
import Link from "next/link";

import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { publicFooterLinks } from "../data/navigation";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-white/6 bg-[#090a0e]">
      <SiteContainer className="py-6 sm:py-7">
        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-90"
            aria-label="KODEKABI Beranda"
          >
            <Image
              src="/logo/logo-horizontal.svg"
              alt="KODEKABI"
              width={169}
              height={40}
              className="h-auto w-[118px] sm:w-[128px]"
            />
          </Link>

          <p className="text-sm leading-6 text-white/34 [text-wrap:balance] lg:text-center">
            Setiap informasi meninggalkan jejak.
          </p>

          <nav aria-label="Link utilitas public site">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end">
              {publicFooterLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/46 transition-colors duration-200 hover:text-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SiteContainer>
    </footer>
  );
}
