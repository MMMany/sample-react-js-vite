import { Navigate } from "react-router";
import { useAuthStore } from "#/stores";

export default function ProtectedRoute({ children }) {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    console.log("move to login");
  }

  return accessToken ? children : <Navigate to="/login" replace={true} />;
}
