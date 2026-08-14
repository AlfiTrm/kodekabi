type AccountPanelProps = {
  onLogout: () => void;
};

export function AccountPanel({ onLogout }: AccountPanelProps) {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5">
      <h2 className="text-xs font-bold">Akun</h2>
      <dl className="mt-4 space-y-4 text-[9px]">
        <div className="flex justify-between gap-4 border-b border-white/6 pb-3"><dt className="text-foreground/40">Email</dt><dd className="text-right">alya@mail.com <span className="text-green">✓</span></dd></div>
        <div className="flex justify-between gap-4 border-b border-white/6 pb-3"><dt className="text-foreground/40">Terhubung</dt><dd>Google</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-foreground/40">Password</dt><dd className="text-purple">Ganti →</dd></div>
      </dl>
      <button type="button" onClick={onLogout} className="mt-5 h-10 w-full rounded-full border border-red/50 bg-red/8 text-[9px] font-bold text-red transition-colors hover:bg-red/18">⇥ Keluar dari Kota Nusa</button>
    </section>
  );
}
