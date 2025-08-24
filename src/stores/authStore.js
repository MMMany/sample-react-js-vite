import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useAuthStore = create(
  devtools(
    persist(
      /**
       * @returns {{
       * user: string | null,
       * token: string | null,
       * isLoggedIn: boolean,
       * setUserAndToken: (user: string, token: string) => void,
       * logout: () => void
       * }}
       */
      (set) => ({
        user: null,
        token: null,
        isLoggedIn: false,
        setUserAndToken: (user, token) => {
          set({
            user,
            token,
            isLoggedIn: !!user && !!token,
          });
        },
        logout: () => {
          set({
            user: null,
            token: null,
            isLoggedIn: false,
          });
        },
      }),
      {
        name: "auth-storage", // unique name
      },
    ),
  ),
);

export default useAuthStore;
