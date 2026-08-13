"use client";

import { useState } from "react";
import type { AdminRedeemItem } from "../types/admin-redeem-item";

export function useAdminRedeemItemForm(item?: AdminRedeemItem, defaultType = "") {
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
  const valid = Boolean(name.trim() && typeCode && partnerName.trim() && description.trim() && Number(priceCoin) >= 0 && Number(maxClaim) >= 0 && Number(minimumLevel) >= 0);
  return {
    values: { name, typeCode, partnerName, priceCoin, maxClaim, claimPeriod, minimumLevel, description, stockVisible, active },
    setters: { setName, setTypeCode, setPartnerName, setPriceCoin, setMaxClaim, setClaimPeriod, setMinimumLevel, setDescription, setStockVisible, setActive },
    valid,
  };
}
