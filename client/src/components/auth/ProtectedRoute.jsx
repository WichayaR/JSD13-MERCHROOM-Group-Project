import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isCustomer, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isCustomer) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
