import type { RegistrationAvatar } from "../../_shared/types/register-auth";

const detectiveAssetNames: Record<string, string> = {
  "mascot-jacket.png": "kabitektif",
  "kabitektif.png": "kabitektif",
  "mascot-detective.png": "kabirius",
  "mascot-sweater.png": "kabinter",
  "mascot-cloak.png": "kabiten",
};

export function mapRegistrationAvatarIds(avatars: RegistrationAvatar[]) {
  const mapped: Record<string, string> = {};

  for (const avatar of avatars) {
    const filename = avatar.image_url.split("/").pop()?.toLowerCase() ?? "";
    const detectiveId = detectiveAssetNames[filename];
    if (detectiveId) mapped[detectiveId] = avatar.avatar_id;
  }

  return mapped;
}

export function findDetectiveIdByAvatar(avatars: RegistrationAvatar[], avatarId?: string) {
  if (!avatarId) return undefined;
  const mapping = mapRegistrationAvatarIds(avatars);
  return Object.entries(mapping).find(([, id]) => id === avatarId)?.[0];
}
