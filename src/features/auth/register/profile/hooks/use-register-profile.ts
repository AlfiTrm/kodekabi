"use client";

import { useActionState, useState } from "react";
import { completeRegistrationAction } from "../../_shared/actions/register-actions";
import { useRegisterSession } from "../../_shared/register-session-context";
import { generateNickname } from "../utils/generate-nickname";

export function useRegisterProfile(initialDetectiveId = "kabitektif") {
  const { draft, updateDraft, updateCosmetics } = useRegisterSession();
  const [state, action, pending] = useActionState(completeRegistrationAction, {});
  const [previewTitleId, setPreviewTitleId] = useState<string | null>(null);
  return {
    draft: { ...draft, detectiveId: initialDetectiveId || draft.detectiveId }, state, action, pending, previewTitleId, setPreviewTitleId,
    setNickname: (nickname: string) => updateDraft({ nickname }),
    randomizeNickname: () => updateDraft({ nickname: generateNickname(draft.nickname) }),
    selectTitle(titleId: string) { updateCosmetics({ titleId }); setPreviewTitleId(null); },
  };
}
