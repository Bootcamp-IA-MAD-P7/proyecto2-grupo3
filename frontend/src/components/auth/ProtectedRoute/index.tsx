import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { TokenStorage } from "../../../services/General/Storage/TokenStorage";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = TokenStorage.getToken();

  if (!token) {
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
}