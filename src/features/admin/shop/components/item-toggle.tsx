type ItemToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
};

export function ItemToggle({ checked, onChange, label, description }: ItemToggleProps) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <p className="text-xs font-semibold">{label}</p>
        <p className="mt-1 text-[10px] text-foreground/35">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${checked ? "bg-green" : "bg-foreground/20"}`}
      >
        <span className={`absolute left-0 top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}
