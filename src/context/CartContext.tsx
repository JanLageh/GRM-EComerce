import type { Product, ProductVariant } from '@/data/products';
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  warrantyExpiry: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  date: string;
}

interface CartState {
  items: CartItem[];
  orders: Order[];
  returns: ReturnRequest[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant: ProductVariant }
  | { type: 'REMOVE_ITEM'; variantId: string }
  | { type: 'UPDATE_QUANTITY'; variantId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_ORDER' }
  | { type: 'REQUEST_RETURN'; orderId: string; reason: string }
  | { type: 'RENEW_WARRANTY'; orderId: string };

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.variant.id === action.variant.id
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, variant: action.variant, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.variant.id !== action.variantId),
      };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.variant.id !== action.variantId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.variant.id === action.variantId ? { ...item, quantity: action.quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'PLACE_ORDER': {
      if (state.items.length === 0) return state;
      const total = state.items.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0
      );
      const now = new Date();
      const maxWarranty = Math.max(...state.items.map((i) => i.product.warrantyYears));
      const warrantyExpiry = new Date(now);
      warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + maxWarranty);

      const order: Order = {
        id: `ORD-${generateId()}`,
        items: [...state.items],
        total,
        date: now.toISOString(),
        status: 'processing',
        warrantyExpiry: warrantyExpiry.toISOString(),
      };
      return { ...state, items: [], orders: [order, ...state.orders] };
    }
    case 'REQUEST_RETURN': {
      const returnReq: ReturnRequest = {
        id: `RET-${generateId()}`,
        orderId: action.orderId,
        reason: action.reason,
        status: 'pending',
        date: new Date().toISOString(),
      };
      return { ...state, returns: [returnReq, ...state.returns] };
    }
    case 'RENEW_WARRANTY': {
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id === action.orderId) {
            const newExpiry = new Date(order.warrantyExpiry);
            newExpiry.setFullYear(newExpiry.getFullYear() + 2);
            return { ...order, warrantyExpiry: newExpiry.toISOString() };
          }
          return order;
        }),
      };
    }
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    orders: [],
    returns: [],
  });

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ state, dispatch, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

