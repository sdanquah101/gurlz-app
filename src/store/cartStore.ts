import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: string;
  vendorName: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          };
        }
        return {
          items: [...state.items, { ...item, quantity: 1 }]
        };
      }),

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(i => i.id !== itemId)
      })),

      updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);