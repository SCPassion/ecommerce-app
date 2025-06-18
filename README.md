# Stripe Integration & Zustand Persist in Next.js

## Stripe Integration

### 1. Install Stripe Packages

```bash
npm install stripe @stripe/stripe-js
```

### 2. Set Environment Variables

Add these to your `.env` and Vercel dashboard:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=https://your-app-url.vercel.app
```

### 3. Stripe Utility

`lib/stripe.ts`:

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});
```

### 4. Checkout Action (Server Action or API Route)

`app/checkout/checkout-action.ts`:

```typescript
"use server";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(items: any[]) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  });
  return session.url;
}
```

### 5. Stripe.js on the Client

`app/checkout/page.tsx`:

```typescript
"use client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutButton({ items }) {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items }),
      headers: { "Content-Type": "application/json" },
    });
    const { url } = await res.json();
    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId: url });
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

---

## Zustand with Persist

### 1. Install Zustand

```bash
npm install zustand
```

### 2. Create a Store with Persist

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

### 3. Use the Store in Components

```typescript
import { useCartStore } from "@/store/cart-store";

function CartComponent() {
  const { items, addItem, removeItem, clearCart } = useCartStore();
  // ...render cart UI
}
```

---

## Summary

- Use Stripe’s secret key on the server and publishable key on the client.
- Always include the full URL (with `https://`) in your environment variables.
- Use Zustand’s `persist` middleware for localStorage cart state.
