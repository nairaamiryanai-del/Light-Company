import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from '../products-data.js';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product, qty) => {
                set((state) => {
                    const existing = state.cart.find((item) => item.productId === product.id);
                    if (existing) {
                        return {
                            cart: state.cart.map((item) =>
                                item.productId === product.id ? { ...item, qty: item.qty + qty } : item
                            )
                        };
                    }
                    return { cart: [...state.cart, { productId: product.id, qty }] };
                });
            },
            updateCartQty: (productId, delta) => {
                set((state) => {
                    return {
                        cart: state.cart.map((item) => {
                            if (item.productId !== productId) return item;
                            const p = PRODUCTS.find((pr) => pr.id === productId);
                            const newQty = item.qty + delta;
                            return newQty < (p?.pack || 1) ? item : { ...item, qty: newQty };
                        })
                    };
                });
            },
            setCartQty: (productId, qty) => {
                set((state) => ({
                    cart: state.cart.map((item) => {
                        if (item.productId !== productId) return item;
                        const p = PRODUCTS.find((pr) => pr.id === productId);
                        return qty < (p?.pack || 1) ? item : { ...item, qty };
                    })
                }));
            },
            removeFromCart: (productId) => {
                set((state) => ({
                    cart: state.cart.filter((item) => item.productId !== productId)
                }));
            },
            clearCart: () => set({ cart: [] }),
            reorder: (order) => {
                set((state) => {
                    let next = [...state.cart];
                    order.items.forEach(item => {
                        const existing = next.find(i => i.productId === item.productId);
                        if (existing) {
                            existing.qty += item.qty;
                        } else {
                            next.push({ productId: item.productId, qty: item.qty });
                        }
                    });
                    return { cart: next };
                });
            }
        }),
        {
            name: 'light_company_cart', // имя ключа в localStorage
        }
    )
);
