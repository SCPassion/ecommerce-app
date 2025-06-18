# Ecommerce App

## Project Overview

This is a modern ecommerce web application built with Next.js, TypeScript, and Tailwind CSS. The project demonstrates a full-featured online store experience, including product browsing, cart management, and a streamlined checkout process.

### Key Technologies Used

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (with persist middleware for cart state)
- **Stripe** (for payment processing)

### Features

- Responsive, mobile-friendly UI
- Product listing and detail pages
- Persistent shopping cart using Zustand and localStorage
- Secure checkout flow with Stripe integration
- Clean, maintainable codebase with modular structure

## Why This Project Is Impressive

- **Modern Stack:** Uses the latest Next.js features and best practices.
- **State Management:** Implements efficient, persistent cart state with Zustand.
- **Real Payment Integration:** Connects to Stripe for real-world checkout experience.
- **Developer Experience:** TypeScript and modular code make it easy to extend and maintain.
- **Production Ready:** Environment variable management, deployment-ready, and follows accessibility and performance best practices.

---

Feel free to explore, learn, and use this project as a foundation for your own ecommerce ideas!

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
