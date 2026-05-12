import type { Order, OrderItem, OrderStatus } from "@/types";

interface CreateOrderInput {
  readonly restaurantId: string;
  readonly tableId: string;
  readonly tableNumber: number;
  readonly items: readonly OrderItem[];
  readonly customerName?: string;
}

interface SyncMessage {
  readonly type: "sync";
  readonly orders: readonly Order[];
}

const CHANNEL_NAME = "mesa-mock-store";

class MockStore {
  private orders: readonly Order[] = [];
  private listeners = new Set<() => void>();
  private channel?: BroadcastChannel;

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        if (event.data?.type === "sync" && Array.isArray(event.data.orders)) {
          this.orders = event.data.orders;
          this.emitToLocalListeners();
        }
      };
    }
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): readonly Order[] => this.orders;

  getServerSnapshot = (): readonly Order[] => EMPTY_ORDERS;

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  createOrder(input: CreateOrderInput): Order {
    const now = Date.now();
    const id = `o-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const total = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const order: Order = {
      id,
      restaurantId: input.restaurantId,
      tableId: input.tableId,
      tableNumber: input.tableNumber,
      items: input.items.map((item) => ({ ...item })),
      total,
      status: "pending",
      customerName: input.customerName,
      createdAt: now,
      updatedAt: now,
    };
    this.orders = [order, ...this.orders];
    this.notify();
    return order;
  }

  updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
    const idx = this.orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;
    const existing = this.orders[idx];
    if (!existing) return undefined;
    const updated: Order = { ...existing, status, updatedAt: Date.now() };
    this.orders = this.orders.map((o, i) => (i === idx ? updated : o));
    this.notify();
    return updated;
  }

  reset(): void {
    this.orders = [];
    this.notify();
  }

  private emitToLocalListeners(): void {
    this.listeners.forEach((l) => l());
  }

  private notify(): void {
    this.emitToLocalListeners();
    if (this.channel) {
      this.channel.postMessage({
        type: "sync",
        orders: this.orders,
      } satisfies SyncMessage);
    }
  }
}

const EMPTY_ORDERS: readonly Order[] = [];

export const mockStore = new MockStore();
