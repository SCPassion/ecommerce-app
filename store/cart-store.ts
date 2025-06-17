import { create } from "zustand";
import { persist } from "zustand/middleware"; // keep track of your zustand state in local storage

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

// new way to use the middleware api with zustand
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
            .filter((item) => item.quantity > 0), // filter out items with quantity 0
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "cart" } // name of the storage key in local storage
  )
);
