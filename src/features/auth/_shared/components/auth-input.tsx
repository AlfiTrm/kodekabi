import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

type AuthInputProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  status?: string;
  maxLength?: number;
  type?: HTMLInputTypeAttribute;
  name?: string;
};

export function AuthInput({ label, value, onChange, hint, status, maxLength, type = "text", name }: AuthInputProps) {
  return (
    <label className="block text-xs font-semibold">
      {label}
      <span className="relative mt-2 block">
        <input name={name} type={type} value={value} maxLength={maxLength} onChange={onChange} className={`h-11 w-full rounded-xl border border-purple bg-surface px-3 text-sm outline-none transition-colors focus:border-foreground ${status ? "pr-20" : ""}`} />
        {status ? <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-normal text-green">{status}</span> : null}
      </span>
      {hint ? <span className="mt-2 block text-[10px] font-normal text-foreground/45">{hint}</span> : null}
    </label>
  );
}
