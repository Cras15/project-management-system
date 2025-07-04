import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useAuthStore = create()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            setUser: (user) => set({ user }),
            login: (token) => set({ token }),
            logout: () => set({ token: null, user: null })
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
