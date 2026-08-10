"use client";

import { useRef } from "react";

export function useDateTimePicker() {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  }

  return { inputRef, openPicker };
}
