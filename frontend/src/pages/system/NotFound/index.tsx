// src/components/errors/NotFoundPage.tsx
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md animate-[bounce_3s_infinite]">
          <HelpCircle className="w-16 h-16 text-indigo-600" />
        </div>

        <h1 className="text-9xl font-black text-slate-200 leading-none -mt-4 mb-4">
          404
        </h1>

        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Página no encontrada
        </h2>

        <p className="text-slate-500 mb-10 text-lg">
          Lo sentimos, la ruta que intentas consultar no existe o no tienes
          permisos para verla.
        </p>

        <button
          onClick={() => navigate(ROUTES.APP.MAIN)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-lg shadow-indigo-200"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>
    </div>
  );
}
