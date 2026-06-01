import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import MainLayout from "../layouts/MainLayout";
import GameMasterPanel from "../pages/GameMasterPanel/GameMasterPanel";
import EscapeRoom from "../pages/ScapeRoom/ScapeRoom";
import GeneralError from "../pages/system/GeneralError";
import NotFoundPage from "../pages/system/NotFound";


export const router = createBrowserRouter([
  {
    path: ROUTES.APP.MAIN,
    errorElement: <GeneralError />,
    element: <EscapeRoom />,
  },
  {
    path: ROUTES.APP.ADMIN,
    errorElement: <GeneralError />,
    element: <MainLayout />,
    children: [
      { index: true, element: <GameMasterPanel /> }
    ],
  },
  // 3. Catch-all
  { path: "*", element: <NotFoundPage /> },
]);