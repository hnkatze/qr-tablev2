export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export interface OrderItem {
  readonly productId: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly notes?: string;
}

export interface Order {
  readonly id: string;
  readonly restaurantId: string;
  readonly tableId: string;
  readonly tableNumber: number;
  readonly items: readonly OrderItem[];
  readonly total: number;
  readonly status: OrderStatus;
  readonly customerName?: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}
