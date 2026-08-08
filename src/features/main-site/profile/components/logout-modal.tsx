import Image from "next/image";
import Link from "next/link";

import { Modal } from "@/src/shared/components/ui/modal";

type LogoutModalProps = {
  onClose: () => void;
};

export function LogoutModal({ onClose }: LogoutModalProps) {
  return (
    <Modal labelledBy="logout-title" onClose={onClose} className="max-w-lg">
      <div className="px-6 pb-6 pt-4 text-center sm:px-8 sm:pb-8">
        <Image src="/mascot/mascot-jacket-peace.webp" alt="Kabitektif melambaikan tangan" width={130} height={140} className="mx-auto h-28 w-auto object-contain" />
        <h2 id="logout-title" className="mt-1 font-display text-3xl font-bold uppercase tracking-[-0.045em]">Udah Mau Pulang<span className="text-orange">?</span></h2>
        <p className="mx-auto mt-3 max-w-sm text-[10px] leading-relaxed text-foreground/50 sm:text-xs">Progresmu aman tersimpan. Kasus yang berjalan bisa dilanjutkan kapan saja.</p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-orange/35 bg-orange/10 p-4 text-left">
          <span className="text-xl" aria-hidden="true">🔥</span>
          <div><p className="text-[9px] font-bold text-orange">Streak 7 hari masih aman</p><p className="mt-1 text-[8px] text-foreground/45">Main 1 kasus sebelum besok 09:12 biar nggak hangus.</p></div>
        </div>

        <button type="button" onClick={onClose} className="mt-5 h-12 w-full rounded-full bg-white text-[10px] font-bold text-button-ink transition-colors hover:bg-orange">Nggak Jadi, Lanjut Main</button>
        <Link href="/" className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-red/50 bg-red/8 text-[10px] font-bold text-red transition-colors hover:bg-red/18">⇥ Keluar</Link>
        <p className="mt-5 text-[8px] text-foreground/25">Masuk lagi kapan saja dengan email atau Google.</p>
      </div>
    </Modal>
  );
}

