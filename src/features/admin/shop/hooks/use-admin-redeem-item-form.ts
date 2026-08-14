"use client";

import { useState } from "react";
import type { AdminRedeemItem } from "../types/admin-redeem-item";

function normalizeRedeemTypeCode(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function useAdminRedeemItemForm(item?: AdminRedeemItem, defaultType = "", defaultTypeName = "") {
  const [name, setName] = useState(item?.name ?? "");
  const [typeCode, setTypeCode] = useState(item?.type?.code ?? defaultType);
  const [partnerName, setPartnerName] = useState(item?.partner_name ?? "");
  const [priceCoin, setPriceCoin] = useState(item ? String(item.price_coin) : "");
  const [maxClaim, setMaxClaim] = useState(item ? String(item.max_claim_per_period) : "1");
  const [claimPeriod, setClaimPeriod] = useState(item?.claim_period ?? "weekly");
  const [minimumLevel, setMinimumLevel] = useState(item ? String(item.minimum_level) : "1");
  const [description, setDescription] = useState(item?.description ?? "");
  const [stockVisible, setStockVisible] = useState(item?.is_stock_visible ?? true);
  const [active, setActive] = useState((item?.status ?? "active") === "active");
  const [customType, setCustomType] = useState(item?.type?.name ?? defaultTypeName);
  const [usesCustomType, setUsesCustomType] = useState(!item && !defaultType);
  const submittedTypeCode = usesCustomType ? normalizeRedeemTypeCode(customType) : typeCode;
  const valid = Boolean(name.trim() && submittedTypeCode && partnerName.trim() && description.trim() && Number(priceCoin) >= 0 && Number(maxClaim) >= 0 && Number(minimumLevel) >= 0);

  function selectType(value: string, label: string) {
    setUsesCustomType(false);
    setTypeCode(value);
    setCustomType(label);
  }

  function writeType(value: string) {
    setUsesCustomType(true);
    setCustomType(value);
  }

  return {
    values: { name, typeCode, customType, usesCustomType, submittedTypeCode, partnerName, priceCoin, maxClaim, claimPeriod, minimumLevel, description, stockVisible, active },
    setters: { setName, writeType, selectType, setPartnerName, setPriceCoin, setMaxClaim, setClaimPeriod, setMinimumLevel, setDescription, setStockVisible, setActive },
    valid,
  };
}
