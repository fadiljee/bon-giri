export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  invoiceNumber: string;
  date: string; // ISO string
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  status: "PENDING" | "COMPLETED";
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}

const STORAGE_KEY = "bon_giri_orders";

export function getOrderHistory(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load order history from localStorage", e);
    return [];
  }
}

export function saveOrderToHistory(order: Omit<OrderRecord, "id" | "date" | "status"> & { status?: "PENDING" | "COMPLETED" }): OrderRecord {
  const newRecord: OrderRecord = {
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toISOString(),
    status: order.status || "PENDING",
    ...order,
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getOrderHistory();
      const updated = [newRecord, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save order history to localStorage", e);
    }
  }

  return newRecord;
}

export function clearOrderHistory(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear order history", e);
    }
  }
}
