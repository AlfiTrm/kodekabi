"use client";

import { useActionState, useState } from "react";
import { createAdminRedeemCodeAction } from "../actions/create-admin-redeem-code-action";
import { uploadAdminRedeemCodesAction } from "../actions/upload-admin-redeem-codes-action";

export function useRedeemCodeUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [redeemItemId, setRedeemItemId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [uploadState, uploadAction, uploadPending] = useActionState(uploadAdminRedeemCodesAction, { error: null });
  const [manualState, manualAction, manualPending] = useActionState(createAdminRedeemCodeAction, { error: null });

  return { file, setFile, redeemItemId, setRedeemItemId, expiresAt, setExpiresAt, uploadState, uploadAction, uploadPending, manualState, manualAction, manualPending };
}
