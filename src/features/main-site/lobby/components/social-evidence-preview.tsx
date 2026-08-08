export function SocialEvidencePreview() {
  return (
    <div className="absolute -bottom-10 right-[-7%] hidden h-64 w-[44%] rotate-[-11deg] rounded-[28px] bg-white p-5 text-button-ink shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:block">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-green/20 text-xs font-bold text-green-shadow">S</span>
        <div className="flex-1 space-y-2">
          <span className="block h-2 w-2/5 rounded-full bg-surface-muted" />
          <span className="block h-2 w-4/5 rounded-full bg-panel-underside" />
        </div>
        <span className="rounded-full bg-red/15 px-2 py-1 text-[8px] font-bold uppercase text-red">Viral</span>
      </div>
      <div className="mt-5 space-y-2">
        <span className="block h-2 w-full rounded-full bg-panel-underside" />
        <span className="block h-2 w-5/6 rounded-full bg-panel-underside" />
      </div>
      <div className="mt-5 grid h-24 place-items-center rounded-2xl bg-panel-underside/65">
        <span className="rounded-full bg-button-ink px-3 py-1.5 text-[8px] font-bold text-white">SEMBUH 27 PENYAKIT?!</span>
      </div>
    </div>
  );
}
