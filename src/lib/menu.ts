import { CATEGORIES, PRODUCTS, RESTAURANT } from "@/lib/mock-data";
import type { Category, Product, Restaurant, Table } from "@/types";

export interface MenuCategory extends Category {
  readonly products: readonly Product[];
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return RESTAURANT.slug === slug ? RESTAURANT : undefined;
}

export function getTableByNumber(
  restaurantId: string,
  tableNumber: number
): Table | undefined {
  if (RESTAURANT.id !== restaurantId) return undefined;
  return RESTAURANT.tables.find((t) => t.number === tableNumber);
}

export function getMenu(restaurantId: string): readonly MenuCategory[] {
  if (RESTAURANT.id !== restaurantId) return [];
  return CATEGORIES.map((category) => ({
    ...category,
    products: PRODUCTS.filter(
      (p) => p.categoryId === category.id && p.available
    ),
  }));
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(value: number, currency: string = "HNL"): string {
  if (currency === "HNL") return `L. ${value.toLocaleString("es-HN")}`;
  return `${currency} ${value.toLocaleString("es-HN")}`;
}
