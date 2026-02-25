import { create } from 'zustand';

export const useUIStore = create((set) => ({
    cartOpen: false,
    accountOpen: false,
    mobileMenuOpen: false,
    searchQuery: "",
    toast: null,
    setCartOpen: (open) => set({ cartOpen: open }),
    setAccountOpen: (open) => set({ accountOpen: open }),
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setToast: (message) => {
        set({ toast: message });
        if (message) {
            setTimeout(() => set({ toast: null }), 3000);
        }
    },
}));
