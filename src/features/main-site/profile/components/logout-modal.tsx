import { userLogoutAction } from "@/src/features/auth/login/actions/user-logout-action";
import { LogoutConfirmModal } from "@/src/shared/components/ui/logout-confirm-modal";

type LogoutModalProps = {
  onClose: () => void;
};

export function LogoutModal({ onClose }: LogoutModalProps) {
  return (
    <LogoutConfirmModal
      action={userLogoutAction}
      description="Apakah kamu yakin ingin keluar? Progres permainanmu tetap tersimpan."
      onClose={onClose}
    />
  );
}
