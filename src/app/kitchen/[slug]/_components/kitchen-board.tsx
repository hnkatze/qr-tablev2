"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChefHat,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  Play,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/menu";
import { useActiveOrders } from "@/lib/hooks/use-orders";
import { mockStore } from "@/lib/mock-store";
import type { Order, OrderStatus, Restaurant } from "@/types";
import { cn } from "@/lib/utils";

interface KitchenBoardProps {
  readonly restaurant: Restaurant;
}

const NEXT_STATUS: Record<
  Exclude<OrderStatus, "delivered">,
  { readonly next: OrderStatus; readonly label: string }
> = {
  pending: { next: "preparing", label: "Empezar a preparar" },
  preparing: { next: "ready", label: "Marcar como listo" },
  ready: { next: "delivered", label: "Marcar entregado" },
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente",
  preparing: "En curso",
  ready: "Listo",
  delivered: "Entregado",
};

export function KitchenBoard({ restaurant }: KitchenBoardProps) {
  const orders = useActiveOrders(restaurant.id);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Volver al demo
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium accent-grape">
            <Sparkles aria-hidden="true" className="size-3" />
            Cocina · {restaurant.name}
          </span>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            Comandas en vivo
          </h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
          <span
            aria-hidden="true"
            className={cn(
              "size-2.5 rounded-full",
              orders.length > 0
                ? "bg-brand-mint animate-pulse"
                : "bg-muted-foreground/40"
            )}
          />
          <span className="text-sm font-medium">
            {orders.length === 0
              ? "Sin pedidos activos"
              : `${orders.length} ${
                  orders.length === 1 ? "comanda activa" : "comandas activas"
                }`}
          </span>
        </div>
      </header>

      {orders.length === 0 ? (
        <EmptyState restaurantSlug={restaurant.slug} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={order}
                currency={restaurant.currency}
                now={now}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

interface OrderCardProps {
  readonly order: Order;
  readonly currency: string;
  readonly now: number;
}

function OrderCard({ order, currency, now }: OrderCardProps) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now - order.createdAt) / 1000)
  );
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const urgency =
    elapsedMinutes >= 15
      ? "danger"
      : elapsedMinutes >= 5
        ? "warning"
        : "ok";

  const next =
    order.status === "delivered" ? null : NEXT_STATUS[order.status];

  return (
    <Card
      className={cn(
        "h-full p-5 transition-all duration-300",
        order.status === "ready" &&
          "ring-2 ring-brand-mint shadow-lg shadow-brand-mint/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mesa
          </p>
          <p className="font-mono text-3xl font-semibold leading-none tracking-tight">
            {order.tableNumber}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-xs font-semibold",
            urgency === "ok" && "bg-brand-mint/30 text-brand-mint-foreground",
            urgency === "warning" &&
              "bg-brand-tangerine/20 text-brand-tangerine",
            urgency === "danger" &&
              "bg-destructive/15 text-destructive animate-pulse"
          )}
          aria-label={`Tiempo de espera: ${formatElapsed(elapsedSeconds)}`}
        >
          {formatElapsed(elapsedSeconds)}
        </span>
        {order.customerName ? (
          <span className="truncate text-xs text-muted-foreground">
            {order.customerName}
          </span>
        ) : null}
      </div>

      <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
        {order.items.map((item) => (
          <li
            key={item.productId}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="min-w-0 flex-1 truncate">
              <span className="font-mono font-semibold text-foreground">
                {item.quantity}×
              </span>{" "}
              <span>{item.name}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Total</span>
        <span className="font-mono text-sm font-semibold">
          {formatPrice(order.total, currency)}
        </span>
      </div>

      {next ? (
        <button
          type="button"
          onClick={() => mockStore.updateOrderStatus(order.id, next.next)}
          className={cn(
            buttonVariants({
              variant: order.status === "ready" ? "default" : "outline",
            }),
            "group mt-4 h-10 w-full text-sm"
          )}
        >
          {order.status === "pending" ? (
            <Play aria-hidden="true" className="mr-1.5 size-3.5" />
          ) : order.status === "preparing" ? (
            <PackageCheck aria-hidden="true" className="mr-1.5 size-3.5" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="mr-1.5 size-3.5" />
          )}
          {next.label}
        </button>
      ) : null}
    </Card>
  );
}

function StatusBadge({ status }: { readonly status: OrderStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        status === "pending" && "bg-brand-tangerine/20 text-brand-tangerine",
        status === "preparing" && "bg-secondary text-secondary-foreground",
        status === "ready" && "bg-brand-mint text-brand-mint-foreground",
        status === "delivered" && "bg-muted text-muted-foreground"
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function EmptyState({ restaurantSlug }: { readonly restaurantSlug: string }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <span
        aria-hidden="true"
        className="grid size-14 place-items-center rounded-full accent-mint"
      >
        <ClipboardList className="size-6" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Cocina lista, sin pedidos</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Cuando un cliente confirme un pedido en una mesa, va a aparecer acá
          al instante. Probá creando uno desde la vista de cliente.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/r/${restaurantSlug}/t/3`}
          className={cn(buttonVariants(), "h-10 px-4 text-sm")}
        >
          <ChefHat aria-hidden="true" className="mr-1.5 size-4" />
          Abrir vista cliente (mesa 3)
        </Link>
      </div>
    </Card>
  );
}

function formatElapsed(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
