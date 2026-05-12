"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChefHat,
  Clock,
  PackageCheck,
  Smile,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/menu";
import { useOrder } from "@/lib/hooks/use-orders";
import type { OrderStatus, Restaurant, Table } from "@/types";
import { cn } from "@/lib/utils";

interface OrderTrackingProps {
  readonly restaurant: Restaurant;
  readonly table: Table;
  readonly orderId: string;
}

interface Step {
  readonly status: OrderStatus;
  readonly title: string;
  readonly icon: typeof Clock;
}

const STEPS: readonly Step[] = [
  { status: "pending", title: "Pedido recibido", icon: Clock },
  { status: "preparing", title: "En preparación", icon: ChefHat },
  { status: "ready", title: "Listo para entregar", icon: PackageCheck },
  { status: "delivered", title: "Entregado", icon: Smile },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  delivered: 3,
};

export function OrderTracking({
  restaurant,
  table,
  orderId,
}: OrderTrackingProps) {
  const order = useOrder(orderId);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-full accent-grape"
        >
          <ChefHat className="size-6" />
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">No encontramos tu pedido</h1>
          <p className="text-base text-muted-foreground">
            Puede que se haya perdido entre tabs o que el demo se haya
            reiniciado. Probá hacer otro pedido.
          </p>
        </div>
        <Link
          href={`/r/${restaurant.slug}/t/${table.number}`}
          className={cn(buttonVariants(), "h-11 px-6 text-sm")}
        >
          Volver al menú de la mesa {table.number}
        </Link>
      </main>
    );
  }

  const currentIndex = STATUS_INDEX[order.status];
  const elapsedSeconds = Math.floor((now - order.createdAt) / 1000);
  const elapsedLabel = formatElapsed(elapsedSeconds);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8 md:px-8">
      <header className="space-y-3">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Volver al demo
        </Link>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium accent-tangerine">
              Mesa {table.number} · {restaurant.name}
            </span>
            <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
              Tu pedido está en camino
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              #{order.id.slice(-8)} · {elapsedLabel} desde que pediste
            </p>
          </div>
        </div>
      </header>

      <Card className="p-6">
        <ol className="space-y-1">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const completed = i < currentIndex;
            const active = i === currentIndex;
            const upcoming = i > currentIndex;
            return (
              <li
                key={step.status}
                className="flex items-stretch gap-4"
                aria-current={active ? "step" : undefined}
              >
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-10 place-items-center rounded-full transition-all duration-300",
                      completed && "bg-brand-mint text-brand-mint-foreground",
                      active &&
                        "bg-brand-tangerine text-brand-tangerine-foreground animate-shine-pulse",
                      upcoming && "bg-muted text-muted-foreground"
                    )}
                  >
                    {completed ? (
                      <Check className="size-5" />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </span>
                  {i < STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "my-1 w-0.5 flex-1 rounded-full transition-colors",
                        completed ? "bg-brand-mint" : "bg-border"
                      )}
                    />
                  ) : null}
                </div>
                <div className="flex-1 pb-6 pt-1.5">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      upcoming && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {active ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {statusHelperCopy(order.status)}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold">Resumen</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight">
                  <span className="font-mono text-muted-foreground">
                    {item.quantity}×{" "}
                  </span>
                  {item.name}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatPrice(item.price, restaurant.currency)} c/u
                </p>
              </div>
              <p className="font-mono text-sm font-semibold">
                {formatPrice(item.price * item.quantity, restaurant.currency)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-mono text-xl font-semibold">
            {formatPrice(order.total, restaurant.currency)}
          </span>
        </div>
        {order.customerName ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Pedido a nombre de{" "}
            <span className="font-medium text-foreground">
              {order.customerName}
            </span>
          </p>
        ) : null}
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/r/${restaurant.slug}/t/${table.number}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 w-full px-6 text-sm sm:flex-1"
          )}
        >
          Hacer otro pedido
        </Link>
        <Link
          href={`/kitchen/${restaurant.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 w-full px-6 text-sm sm:flex-1"
          )}
        >
          Ver vista de cocina
        </Link>
      </div>
    </main>
  );
}

function statusHelperCopy(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Cocina vio tu comanda y va a empezar pronto.";
    case "preparing":
      return "Tu pedido está cocinándose. Ya casi.";
    case "ready":
      return "Listo. Tu mesero te lo lleva en cualquier momento.";
    case "delivered":
      return "Disfrutalo, alero. Gracias por venir.";
  }
}

function formatElapsed(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}
