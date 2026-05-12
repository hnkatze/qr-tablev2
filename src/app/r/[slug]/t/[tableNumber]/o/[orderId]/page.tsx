import { notFound } from "next/navigation";
import { getRestaurantBySlug, getTableByNumber } from "@/lib/menu";
import { OrderTracking } from "./_components/order-tracking";

interface PageProps {
  readonly params: Promise<{
    slug: string;
    tableNumber: string;
    orderId: string;
  }>;
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { slug, tableNumber, orderId } = await params;
  const tableNumberInt = Number.parseInt(tableNumber, 10);
  if (Number.isNaN(tableNumberInt)) notFound();

  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const table = getTableByNumber(restaurant.id, tableNumberInt);
  if (!table) notFound();

  return (
    <OrderTracking restaurant={restaurant} table={table} orderId={orderId} />
  );
}
