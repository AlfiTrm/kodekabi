"use client";

import type { ReactNode } from "react";

import { Modal } from "./modal";

type ConfirmationModalProps = {
  labelledBy: string;
  title: string;
  description?: string;
  leading?: ReactNode;
  children?: ReactNode;
  footer: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  closeDisabled?: boolean;
  className?: string;
};

export function ConfirmationModal({
  labelledBy,
  title,
  description,
  leading,
  children,
  footer,
  onClose,
  showCloseButton = false,
  closeDisabled = false,
  className = "",
}: ConfirmationModalProps) {
  const handleClose = closeDisabled ? () => undefined : onClose;

  return (
    <Modal
      labelledBy={labelledBy}
      onClose={handleClose}
      className={`max-w-[500px] rounded-2xl ${className}`}
      overlayClassName="bg-black/70"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-4">
          {leading}
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id={labelledBy} className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground">
              {title}
            </h2>
            {description ? <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-foreground/50">{description}</p> : null}
          </div>
          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              disabled={closeDisabled}
              aria-label="Tutup dialog"
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-border-strong text-sm text-foreground/45 transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-wait disabled:opacity-40"
            >
              &times;
            </button>
          ) : null}
        </div>

        {children ? <div className="mt-6">{children}</div> : null}
        <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">{footer}</div>
      </div>
    </Modal>
  );
}
