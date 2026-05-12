"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronUp, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, type MenuCategory } from "@/lib/menu";
import { mockStore } from "@/lib/mock-store";
import type { OrderItem, Product, Restaurant, Table } from "@/types";
import { cn } from "@/lib/utils";

interface MenuViewProps {
  readonly restaurant: Restaurant;
  readonly table: Table;
  readonly menu: readonly MenuCategory[];
  readonly products: readonly Product[];
}

export function MenuView({
  restaurant,
  table,
  menu,
  products,
}: MenuViewProps) {
  const router = useRouter();
  const [cart, setCart] = useState<ReadonlyMap<string, number>>(new Map());
  const [customerName, setCustomerName] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [submitting, startSubmit] = useTransition();

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p] as const)),
    [products]
  );

  const cartItems = useMemo<readonly OrderItem[]>(() => {
    const items: OrderItem[] = [];
    cart.forEach((quantity, productId) => {
      const product = productById.get(productId);
      if (!product || quantity <= 0) return;
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    });
    return items;
  }, [cart, productById]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addItem = (productId: string): void => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(productId, (next.get(productId) ?? 0) + 1);
      return next;
    });
  };

  const decrementItem = (productId: string): void => {
    setCart((prev) => {
      const next = new Map(prev);
      const current = next.get(productId) ?? 0;
      if (current <= 1) {
        next.delete(productId);
      } else {
        next.set(productId, current - 1);
      }
      return next;
    });
  };

  const submit = (): void => {
    if (cartItems.length === 0) return;
    startSubmit(() => {
      const order = mockStore.createOrder({
        restaurantId: restaurant.id,
        tableId: table.id,
        tableNumber: table.number,
        items: cartItems,
        customerName: customerName.trim() || undefined,
      });
      router.push(
        `/r/${restaurant.slug}/t/${table.number}/o/${order.id}`
      );
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-32 md:px-8">
      <header className="space-y-4 py-8">
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
              Mesa {table.number}
            </span>
            <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
              {restaurant.name}
            </h1>
            {restaurant.tagline ? (
              <p className="text-sm text-muted-foreground">
                {restaurant.tagline}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <nav
        aria-label="Categorías"
        className="sticky top-16 z-20 -mx-4 mb-6 flex gap-2 overflow-x-auto bg-background/70 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8"
      >
        {menu.map((category) => (
          <a
            key={category.id}
            href={`#cat-${category.slug}`}
            className="shrink-0 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            {category.name}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {menu.map((category) => (
          <section
            key={category.id}
            id={`cat-${category.slug}`}
            aria-labelledby={`heading-${category.slug}`}
            className="scroll-mt-32 space-y-4"
          >
            <h2
              id={`heading-${category.slug}`}
              className="text-lg font-semibold tracking-tight"
            >
              {category.name}
            </h2>
            <ul className="space-y-3">
              {category.products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  currency={restaurant.currency}
                  quantity={cart.get(product.id) ?? 0}
                  onAdd={() => addItem(product.id)}
                  onRemove={() => decrementItem(product.id)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <CartBar
        count={cartCount}
        total={cartTotal}
        currency={restaurant.currency}
        expanded={expanded}
        onToggle={() => setExpanded((open) => !open)}
        items={cartItems}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        onAdd={addItem}
        onRemove={decrementItem}
        onSubmit={submit}
        submitting={submitting}
      />
    </div>
  );
}

interface ProductRowProps {
  readonly product: Product;
  readonly currency: string;
  readonly quantity: number;
  readonly onAdd: () => void;
  readonly onRemove: () => void;
}

function ProductRow({
  product,
  currency,
  quantity,
  onAdd,
  onRemove,
}: ProductRowProps) {
  return (
    <li>
      <Card
        className={cn(
          "flex flex-row items-center gap-4 p-4 transition-shadow hover:shadow-md",
          quantity > 0 && "ring-2 ring-brand-tangerine/40"
        )}
      >
        {product.emoji ? (
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted text-2xl"
          >
            {product.emoji}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">{product.name}</p>
          {product.description ? (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {product.description}
            </p>
          ) : null}
          <p className="mt-1.5 font-mono text-sm font-semibold text-foreground">
            {formatPrice(product.price, currency)}
          </p>
        </div>
        <QuantityControls
          quantity={quantity}
          onAdd={onAdd}
          onRemove={onRemove}
          label={product.name}
        />
      </Card>
    </li>
  );
}

interface QuantityControlsProps {
  readonly quantity: number;
  readonly onAdd: () => void;
  readonly onRemove: () => void;
  readonly label: string;
}

function QuantityControls({
  quantity,
  onAdd,
  onRemove,
  label,
}: QuantityControlsProps) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Agregar ${label}`}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    );
  }
  return (
    <div
      aria-label={`Cantidad de ${label}`}
      className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-2 py-1"
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar uno de ${label}`}
        className="grid size-7 place-items-center rounded-full bg-card text-foreground transition-transform hover:scale-110 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
      >
        <Minus aria-hidden="true" className="size-3" />
      </button>
      <span
        className="min-w-6 text-center font-mono text-sm font-semibold tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Agregar uno de ${label}`}
        className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
      >
        <Plus aria-hidden="true" className="size-3" />
      </button>
    </div>
  );
}

interface CartBarProps {
  readonly count: number;
  readonly total: number;
  readonly currency: string;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly items: readonly OrderItem[];
  readonly customerName: string;
  readonly onCustomerNameChange: (value: string) => void;
  readonly onAdd: (productId: string) => void;
  readonly onRemove: (productId: string) => void;
  readonly onSubmit: () => void;
  readonly submitting: boolean;
}

function CartBar({
  count,
  total,
  currency,
  expanded,
  onToggle,
  items,
  customerName,
  onCustomerNameChange,
  onAdd,
  onRemove,
  onSubmit,
  submitting,
}: CartBarProps) {
  if (count === 0) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-6">
        <div className="rounded-full bg-card/90 px-5 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur">
          Agregá productos para empezar tu pedido
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 md:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-foreground/10">
        {expanded ? (
          <div className="max-h-[60vh] overflow-y-auto p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <ShoppingBag aria-hidden="true" className="size-4" />
                Tu pedido
              </h2>
              <button
                type="button"
                onClick={onToggle}
                aria-label="Cerrar resumen"
                className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {formatPrice(item.price, currency)} c/u
                    </p>
                  </div>
                  <QuantityControls
                    quantity={item.quantity}
                    onAdd={() => onAdd(item.productId)}
                    onRemove={() => onRemove(item.productId)}
                    label={item.name}
                  />
                  <p className="w-20 shrink-0 text-right font-mono text-sm font-semibold">
                    {formatPrice(item.price * item.quantity, currency)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-3 border-t border-border pt-4">
              <label className="block text-xs font-medium" htmlFor="cart-name">
                Tu nombre (opcional)
              </label>
              <input
                id="cart-name"
                type="text"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                placeholder="Para que cocina sepa pa' quién"
                maxLength={40}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-brand-tangerine focus:ring-2 focus:ring-brand-tangerine/30"
              />
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-mono text-xl font-semibold">
                  {formatPrice(total, currency)}
                </span>
              </div>
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className={cn(
                  buttonVariants(),
                  "h-12 w-full text-base disabled:opacity-50"
                )}
              >
                {submitting
                  ? "Enviando a cocina..."
                  : `Confirmar pedido · ${formatPrice(total, currency)}`}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="group flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50"
          >
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="relative grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"
              >
                <ShoppingBag className="size-4" />
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand-grape text-[10px] font-semibold text-brand-grape-foreground">
                  {count}
                </span>
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">
                  {count === 1 ? "1 producto" : `${count} productos`}
                </span>
                <span className="block font-mono text-base font-semibold">
                  {formatPrice(total, currency)}
                </span>
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              Ver pedido
              <ChevronUp
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0"
              />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
