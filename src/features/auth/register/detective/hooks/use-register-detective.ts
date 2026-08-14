"use client";

import { useActionState, useState } from "react";
import { selectRegistrationAvatarAction } from "../../_shared/actions/register-actions";
import { useRegisterSession } from "../../_shared/register-session-context";

export function useRegisterDetective(initialDetectiveId = "kabitektif") {
  const { draft, updateDraft, updateCosmetics } = useRegisterSession();
  const [state, action, pending] = useActionState(selectRegistrationAvatarAction, {});
  const [selectedId, setSelectedId] = useState(initialDetectiveId || draft.detectiveId);
  const [previewedId, setPreviewedId] = useState<string | null>(null);

  function select(detectiveId: string, cosmeticAvatarId: string) {
    setSelectedId(detectiveId);
    updateDraft({ detectiveId });
    updateCosmetics({ avatarId: cosmeticAvatarId });
  }

  return { state, action, pending, selectedId, previewedId, setPreviewedId, select };
}
