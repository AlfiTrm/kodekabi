"use client";

import { useState } from "react";

export function useCredibilityTags(selected: string[], onChange: (tags: string[]) => void) {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen((current) => !current);
  }

  function toggleTag(value: string) {
    onChange(selected.includes(value) ? selected.filter((tag) => tag !== value) : [...selected, value]);
  }

  return { open, toggleOpen, toggleTag };
}
