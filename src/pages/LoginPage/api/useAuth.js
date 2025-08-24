import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/stores";

async function loginRequest(credentials) {
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login Failed");
  }

  return response.json();
}

export function useLogin() {
  const { setUserAndToken } = useAuthStore();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      const { user, token } = data;
      setUserAndToken(user, token);
    },
    onError: (error) => {
      console.error(error);
      setUserAndToken(null, null);
    },
  });
}

async function checkAuthCodeRequest() {
  // check auth info with cookie of "__auth_code" (HttpOnly, Secure, Strict)
  const response = await fetch("/check-auth");

  if (!response.ok) {
    throw new Error("Auth check failed");
  }

  // { accessToken: string, user: object }
  return response.json();
}

export function useCheckAuthCode() {
  const { setUserAndToken } = useAuthStore();

  return useMutation({
    mutationFn: checkAuthCodeRequest,
    onSuccess: ({ accessToken, user }) => {
      setUserAndToken(user, accessToken);
    },
    onError: (error) => {
      console.error(error);
      setUserAndToken(null, null);
    },
  });
}
