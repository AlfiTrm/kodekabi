"use client";

import { useState } from "react";

import type { AdminItem } from "../types/admin-item";

export function useAdminItemForm(item?: AdminItem, defaultCategoryId = "") {
  const [name, setName] = useState(item?.name ?? "");
  const [categoryId, setCategoryId] = useState(item?.item_category_id ?? defaultCategoryId);
  const [description, setDescription] = useState(item?.description ?? "");
  const [priceCoin, setPriceCoin] = useState(item ? String(item.price_coin) : "");
  const [status, setStatus] = useState(item?.status ?? "active");
  const [isVisible, setIsVisible] = useState(item?.is_visible ?? true);
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false);

  const valid = Boolean(name.trim() && categoryId && description.trim() && priceCoin !== "" && Number(priceCoin) >= 0);

  return {
    values: { name, categoryId, description, priceCoin, status, isVisible, isFeatured },
    setters: { setName, setCategoryId, setDescription, setPriceCoin, setStatus, setIsVisible, setIsFeatured },
    valid,
  };
}
