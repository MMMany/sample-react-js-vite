import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/stores";

async function loginRequest(credentials) {
  const { data } = await axios.post("/auth/v1/login", JSON.stringify(credentials));

  if (!data) {
    throw new Error("Login Failed");
  }

  return data;
}

export function useLogin() {
  const { setUser, setAccessToken, logout: clear } = useAuthStore();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      const { username, email, roles, accessToken } = data;
      setUser({ username, email, roles });
      setAccessToken(accessToken);
    },
    onError: (error) => {
      console.error(error);
      clear();
    },
  });
}
