# Zustand with Persist

## 1. Install Zustand

```bash
npm install zustand
```

## 2. Create a Store with Persist

`store/cart-store.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

export type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, item],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart" }
  )
);
```

## 3. Use the Store in Components

```typescript
import { useCartStore } from "@/store/cart-store";

function CartComponent() {
  const { items, addItem, removeItem, clearCart } = useCartStore();
  // ...render cart UI
}
```

---

## Summary

- Use Zustand’s `persist` middleware for localStorage cart state.
