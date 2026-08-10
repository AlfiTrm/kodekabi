import type { ChangeEvent, HTMLInputTypeAttribute, ReactNode } from "react";

type AuthInputProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  status?: string;
  maxLength?: number;
  type?: HTMLInputTypeAttribute;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  labelAction?: ReactNode;
  endAdornment?: ReactNode;
};

export function AuthInput({
  label,
  value,
  onChange,
  hint,
  status,
  maxLength,
  type = "text",
  name,
  placeholder,
  autoComplete,
  required,
  disabled,
  invalid,
  labelAction,
  endAdornment,
}: AuthInputProps) {
  return (
    <label className="block text-xs font-semibold">
      <span className="flex items-center justify-between gap-4">
        <span>{label}</span>
        {labelAction}
      </span>
      <span className="relative mt-2 block">
        <input
          name={name}
          type={type}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={`h-11 w-full rounded-xl border bg-surface px-3 text-xs outline-none transition-colors placeholder:text-foreground/30 disabled:cursor-not-allowed disabled:opacity-60 ${invalid ? "border-red focus:border-red" : "border-border-strong focus:border-purple"} ${status || endAdornment ? "pr-20" : ""}`}
        />
        {status ? <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-normal text-green">{status}</span> : null}
        {endAdornment ? <span className="absolute inset-y-0 right-3 flex items-center">{endAdornment}</span> : null}
      </span>
      {hint ? <span className="mt-2 block text-[10px] font-normal text-foreground/45">{hint}</span> : null}
    </label>
  );
}
