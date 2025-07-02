import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useAuthStore = create()(
    persist(
        (set, get) => ({
            token: null,
            login: (token) => set({ token }),
            logout: () => set({ token: null }),
            isAuthenticated: () => !!get().token,
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
