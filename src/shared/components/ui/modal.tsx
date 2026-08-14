"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  className?: string;
  overlayClassName?: string;
};

export function Modal({ children, labelledBy, onClose, className = "", overlayClassName = "bg-background/90" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4 backdrop-blur-sm ${overlayClassName}`} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className={`my-auto w-full rounded-3xl border border-white/12 bg-surface shadow-[0_28px_90px_rgba(0,0,0,0.55)] outline-none ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
