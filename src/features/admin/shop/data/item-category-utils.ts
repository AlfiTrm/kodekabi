import type { AdminItem, AdminItemCategory } from "../types/admin-item";

export function uniqueItemCategories(items: AdminItem[], requiredCategory?: AdminItemCategory) {
  const categories = new Map<string, AdminItemCategory>();
  if (requiredCategory?.item_category_id) categories.set(requiredCategory.item_category_id, requiredCategory);
  items.forEach((item) => {
    if (item.category?.item_category_id) categories.set(item.category.item_category_id, item.category);
  });
  return [...categories.values()].sort((left, right) => left.name.localeCompare(right.name, "id-ID"));
}

