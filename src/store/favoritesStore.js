import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
    persist(
        (set) => ({
            favorites: new Set(),
            toggleFavorite: (id) =>
                set((state) => {
                    const nextFavorites = new Set(state.favorites);
                    if (nextFavorites.has(id)) {
                        nextFavorites.delete(id);
                    } else {
                        nextFavorites.add(id);
                    }
                    return { favorites: nextFavorites };
                }),
            clearFavorites: () => set({ favorites: new Set() }),
        }),
        {
            name: 'light_company_favorites',
            // Custom storage is needed for Sets because they don't natively JSON stringify
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    const { state } = JSON.parse(str);
                    return {
                        state: {
                            ...state,
                            favorites: new Set(state.favorites),
                        },
                    };
                },
                setItem: (name, newValue) => {
                    const str = JSON.stringify({
                        state: {
                            ...newValue.state,
                            favorites: Array.from(newValue.state.favorites),
                        },
                    });
                    localStorage.setItem(name, str);
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);
