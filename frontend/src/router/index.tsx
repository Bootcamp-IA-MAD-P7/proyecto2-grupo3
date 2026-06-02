import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { ROUTES } from "../constants/routes";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import GameMasterPanel from "../pages/gameMasterPanel/GameMasterPanel";
import EscapeRoom from "../pages/scapeRoom/ScapeRoom";
import GeneralError from "../pages/system/GeneralError";
import NotFoundPage from "../pages/system/NotFound";

export const router = createBrowserRouter([
  {
    path: ROUTES.AUTH.LOGIN,
    element: <Login />,
  },

  {
    path: ROUTES.APP.MAIN,
    element: <ProtectedRoute />,
    errorElement: <GeneralError />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: `${ROUTES.APP.GAME_MASTER_PANEL}:salaId`, element: <GameMasterPanel /> },
        ],
      },
      { path: `${ROUTES.APP.ESCAPE_ROOM}:salaId`, element: <EscapeRoom /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
