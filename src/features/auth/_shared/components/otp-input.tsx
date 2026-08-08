"use client";

import { useRef, type ChangeEvent, type KeyboardEvent } from "react";

type OtpInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  length?: number;
};

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function updateDigit(index: number, event: ChangeEvent<HTMLInputElement>) {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="Kode OTP">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => { inputRefs.current[index] = element; }}
          value={value[index] ?? ""}
          onChange={(event) => updateDigit(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          className={`h-14 w-12 rounded-2xl border bg-surface text-center font-display text-2xl font-bold text-foreground outline-none transition-colors sm:h-16 sm:w-16 ${value[index] ? "border-green" : index === value.findIndex((digit) => !digit) ? "border-purple ring-2 ring-purple/15" : "border-border-strong"}`}
        />
      ))}
    </div>
  );
}
