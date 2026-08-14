import type { UserProfileAccount } from "../types/profile";

type AccountPanelProps = { account: UserProfileAccount; coinBalance: number; onLogout: () => void };

export function AccountPanel({ account, coinBalance, onLogout }: AccountPanelProps) {
  const connectionLabel = account.connected_to === "local" ? "Email & password" : account.connected_to;
  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5">
      <h2 className="text-xs font-bold">Akun</h2>
      <dl className="mt-4 space-y-4 text-[9px]">
        <div className="flex justify-between gap-4 border-b border-white/6 pb-3"><dt className="text-foreground/40">Email</dt><dd className="break-all text-right">{account.email}<span className={`ml-2 ${account.is_email_verified ? "text-green" : "text-orange"}`}>{account.is_email_verified ? "Terverifikasi" : "Belum diverifikasi"}</span></dd></div>
        <div className="flex justify-between gap-4 border-b border-white/6 pb-3"><dt className="text-foreground/40">Terhubung</dt><dd className="capitalize">{connectionLabel}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-foreground/40">Saldo</dt><dd className="text-orange">{coinBalance.toLocaleString("id-ID")} koin</dd></div>
      </dl>
      <button type="button" onClick={onLogout} className="mt-5 h-10 w-full cursor-pointer rounded-full border border-red/50 bg-red/8 text-[9px] font-bold text-red transition-colors hover:bg-red/18">Keluar dari Kota Nusa</button>
    </section>
  );
}
