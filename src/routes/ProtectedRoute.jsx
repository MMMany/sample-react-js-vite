import { Navigate } from "react-router";
import { useAuthStore } from "#/stores";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore();

  return isLoggedIn ? children : <Navigate to="/login" replace={true} />;
}
