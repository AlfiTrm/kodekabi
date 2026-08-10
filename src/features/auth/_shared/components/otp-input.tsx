"use client";

import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";

type OtpInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  length?: number;
  size?: "compact" | "default";
  tone?: "orange" | "purple";
  disabled?: boolean;
};

export function OtpInput({ value, onChange, length = 6, size = "default", tone = "purple", disabled = false }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const activeIndex = value.findIndex((digit) => !digit);
  const activeBorder = tone === "orange" ? "border-orange ring-orange/15" : "border-purple ring-purple/15";
  const sizeClasses = size === "compact" ? "h-12 w-10 rounded-xl text-lg sm:h-12 sm:w-11" : "h-14 w-12 rounded-2xl text-2xl sm:h-16 sm:w-16";

  function applyDigits(startIndex: number, rawValue: string) {
    const pastedDigits = rawValue.replace(/\D/g, "");
    if (!pastedDigits) return;

    const insertAt = pastedDigits.length >= length ? 0 : startIndex;
    const next = [...value];
    pastedDigits.slice(0, length - insertAt).split("").forEach((digit, offset) => {
      next[insertAt + offset] = digit;
    });
    onChange(next);

    const focusIndex = Math.min(insertAt + pastedDigits.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  function updateDigit(index: number, event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value.replace(/\D/g, "");
    if (rawValue.length > 1) {
      applyDigits(index, rawValue);
      return;
    }

    const digit = rawValue.slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pastedValue = event.clipboardData.getData("text");
    if (!/\d/.test(pastedValue)) return;

    event.preventDefault();
    applyDigits(index, pastedValue);
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
          onPaste={(event) => handlePaste(index, event)}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          className={`border bg-surface text-center font-display font-bold text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses} ${value[index] ? "border-green" : index === (activeIndex === -1 ? length - 1 : activeIndex) ? `${activeBorder} ring-2` : "border-border-strong"}`}
        />
      ))}
    </div>
  );
}
