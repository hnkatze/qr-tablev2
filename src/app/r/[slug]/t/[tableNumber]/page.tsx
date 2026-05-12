import { notFound } from "next/navigation";
import { getMenu, getRestaurantBySlug, getTableByNumber } from "@/lib/menu";
import { PRODUCTS } from "@/lib/mock-data";
import { MenuView } from "./_components/menu-view";

interface PageProps {
  readonly params: Promise<{ slug: string; tableNumber: string }>;
}

export default async function CustomerMenuPage({ params }: PageProps) {
  const { slug, tableNumber } = await params;
  const tableNumberInt = Number.parseInt(tableNumber, 10);
  if (Number.isNaN(tableNumberInt)) notFound();

  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const table = getTableByNumber(restaurant.id, tableNumberInt);
  if (!table) notFound();

  const menu = getMenu(restaurant.id);

  return (
    <MenuView
      restaurant={restaurant}
      table={table}
      menu={menu}
      products={PRODUCTS}
    />
  );
}
