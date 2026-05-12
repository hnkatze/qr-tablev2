import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/lib/menu";
import { KitchenBoard } from "./_components/kitchen-board";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export default async function KitchenPage({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  return <KitchenBoard restaurant={restaurant} />;
}
