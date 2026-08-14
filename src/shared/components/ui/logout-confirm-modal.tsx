"use client";

import { useFormStatus } from "react-dom";

import { ConfirmationModal } from "./confirmation-modal";

type LogoutConfirmModalProps = {
  action: (formData: FormData) => void | Promise<void>;
  description: string;
  onClose: () => void;
};

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 min-w-28 cursor-pointer items-center justify-center rounded-full bg-red px-5 text-xs font-bold text-white transition-colors hover:bg-red/85 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Keluar..." : "Ya, Logout"}
    </button>
  );
}

export function LogoutConfirmModal({ action, description, onClose }: LogoutConfirmModalProps) {
  return (
    <ConfirmationModal
      labelledBy="logout-confirm-title"
      title="Konfirmasi Logout"
      description={description}
      onClose={onClose}
      leading={(
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-red/12 text-red" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
          </svg>
        </span>
      )}
      footer={(
        <form action={action} className="flex gap-3">
          <button type="button" onClick={onClose} className="inline-flex h-10 min-w-20 cursor-pointer items-center justify-center rounded-full border border-border-strong px-5 text-xs font-semibold text-foreground/55 transition-colors hover:bg-surface-muted hover:text-foreground">
            Batal
          </button>
          <ConfirmButton />
        </form>
      )}
    />
  );
}
