import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            login: (userData) => set({ user: userData }),
            logout: () => set({ user: null }),
            updateUser: (updatedData) => set({ user: updatedData }),
        }),
        {
            name: 'light_company_user', // имя ключа в localStorage
        }
    )
);
