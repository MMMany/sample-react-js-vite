import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useAuthStore = create(
  devtools(
    persist(
      /**
       * @returns {{
       * username: string | null,
       * email: string | null,
       * roles: string[],
       * accessToken: string | null,
       * isRefreshing: boolean,
       * setUser: (info: { username: string, email: string, roles: string[] }) => void,
       * setAccessToken: (token: string) => void,
       * setIsRefreshing: (flag: boolean) => void,
       * logout: () => void,
       * }}
       */
      (set) => ({
        username: null,
        email: null,
        roles: [],
        accessToken: null,
        isRefreshing: false,
        setUser: ({ username, email, roles }) => set({ username, email, roles }),
        setAccessToken: (token) => set({ accessToken: token }),
        setIsRefreshing: (flag) => set({ isRefreshing: flag }),
        logout: () => set({ username: null, email: null, roles: [], accessToken: null, isRefreshing: false }),
      }),
      {
        name: "auth-storage", // unique name
      },
    ),
  ),
);

export default useAuthStore;
