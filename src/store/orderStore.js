import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ORDER_STATUSES = ["Сформирован", "В работе", "Отгружен", "Завершен"];

export const useOrderStore = create(
    persist(
        (set) => ({
            orders: [],
            addOrder: (order) => set((state) => ({
                orders: [...state.orders, {
                    ...order,
                    statusHistory: [{ status: order.status || "Сформирован", date: order.date || new Date().toISOString() }]
                }]
            })),
            updateOrderStatus: (orderId, newStatus, comment) => set((state) => ({
                orders: state.orders.map((o) => {
                    if (o.id !== orderId) return o;
                    const history = o.statusHistory || [{ status: o.status, date: o.date }];
                    return {
                        ...o,
                        status: newStatus,
                        statusHistory: [...history, { status: newStatus, date: new Date().toISOString(), comment }]
                    };
                })
            })),
            setOrders: (newOrders) => set({ orders: newOrders }),
        }),
        {
            name: 'light_company_orders',
        }
    )
);
