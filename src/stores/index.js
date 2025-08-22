import { create } from "zustand";

function login() {}

function logout() {}

const useAuth = create((set) => ({
  username: "",
  roles: [],
  isLoggedIn: false,
  isPending: false,
  login,
  logout,
}));
