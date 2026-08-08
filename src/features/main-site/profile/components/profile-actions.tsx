type ProfileActionsProps = {
  onEdit: () => void;
};

export function ProfileActions({ onEdit }: ProfileActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" onClick={onEdit} className="h-11 rounded-full bg-white text-[10px] font-bold text-button-ink transition-colors hover:bg-orange">Edit Profil</button>
      <button type="button" className="h-11 rounded-full border border-border-strong bg-transparent text-[10px] font-bold text-foreground transition-colors hover:border-purple hover:bg-purple/10">Bagikan Kartu</button>
    </div>
  );
}

