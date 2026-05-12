"use client";

import { useMemo, useSyncExternalStore } from "react";
import { mockStore } from "@/lib/mock-store";
import type { Order } from "@/types";

function useAllOrders(): readonly Order[] {
  return useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getSnapshot,
    mockStore.getServerSnapshot
  );
}

export function useOrdersByRestaurant(
  restaurantId: string
): readonly Order[] {
  const all = useAllOrders();
  return useMemo(
    () => all.filter((o) => o.restaurantId === restaurantId),
    [all, restaurantId]
  );
}

export function useActiveOrders(restaurantId: string): readonly Order[] {
  const all = useAllOrders();
  return useMemo(
    () =>
      all.filter(
        (o) => o.restaurantId === restaurantId && o.status !== "delivered"
      ),
    [all, restaurantId]
  );
}

export function useOrder(orderId: string | undefined): Order | undefined {
  const all = useAllOrders();
  return useMemo(
    () => (orderId ? all.find((o) => o.id === orderId) : undefined),
    [all, orderId]
  );
}
