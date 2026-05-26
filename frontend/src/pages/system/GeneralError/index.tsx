// src/components/errors/GeneralError.tsx
import { AlertTriangle, RefreshCcw } from "lucide-react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

export default function GeneralError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "Ha ocurrido un error inesperado.";
  let errorTitle = "Error del Sistema";

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || "Hubo un problema con la petición.";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="max-w-sm w-full bg-white p-8 text-center rounded-3xl shadow-lg">
        
        <div className="inline-flex p-4 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {errorTitle}
        </h2>

        <p className="font-mono text-sm bg-slate-100 p-4 rounded-xl mb-8 text-slate-500 break-all">
          {errorMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-bold"
          >
            <RefreshCcw size={18} />
            Recargar
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-bold"
          >
            Ir al Inicio
          </button>
        </div>

      </div>
    </div>
  );
}