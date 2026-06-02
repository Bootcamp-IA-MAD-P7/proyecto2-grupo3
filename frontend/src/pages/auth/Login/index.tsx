import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import factoriaLogo from "../../../assets/factoria.png";
import scapeRoomLogo from "../../../assets/scape-room.jpg";
import { ROUTES } from "../../../constants/routes";
import { TokenStorage } from "../../../services/General/Storage/TokenStorage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Usamos el hook mutacional que creamos con React Query
  //const { mutate: authenticate, isPending } = useAuthenticate();
  const isPending = false; // Placeholder mientras se implementa la lógica de autenticación real

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    TokenStorage.setToken("dummy-token"); // Simulamos un login exitoso guardando un token de prueba
    navigate(ROUTES.APP.MAIN);

    /*authenticate(
      { usuario, password },
      {
        
        onSuccess: (res) => {
          if (res.rpt === 0 && res.data) {
            // Guardamos todo en el Storage
            TokenStorage.setToken(res.data.token);
            TokenStorage.setRefreshToken(res.data.refreshToken);
            // El backend nos manda el usuario con los módulos listos, lo guardamos
            TokenStorage.setUserData(JSON.stringify(res.data));

            // Redirigimos al área de trabajo
            navigate(ROUTES.APP.MAIN);
          } else {
            // Error controlado por el backend (ej: credenciales incorrectas)
            setErrorMsg(res.mensaje || "Credenciales inválidas.");
          }
        },
        onError: (error) => {
          // Error de red o 500 del servidor
          setErrorMsg("Error de conexión con el servidor.");
          console.error("Error en login:", error);
        },
      }
    );*/
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4 font-sans animate-fade-in">
      <div className="flex w-full max-w-5xl h-[700px] overflow-hidden rounded-[40px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] bg-slate-900 border border-slate-800">
        {/* PANEL IZQUIERDO */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white flex-col items-center justify-center p-12 relative border-r border-slate-800">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />

          <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
            <div className="bg-slate-900 text-white w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl shadow-[0_10px_15px_-3px_rgba(59,130,246,0.3)] border border-slate-700">
              <img
                src={factoriaLogo}
                alt="Factoria Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest leading-tight text-slate-400">
                SISTEMA DE
              </span>
              <span className="text-sm font-black leading-tight tracking-tight text-white">
                ESCAPE ROOM
              </span>
            </div>
          </div>

          <div className="relative z-10 text-center flex flex-col items-center mt-4">
            <div className="w-64 h-64 bg-slate-800 rounded-full flex items-center justify-center p-6 mx-auto mb-6 shadow-[0_0_50px_-5px_rgba(59,130,246,0.3)] border border-slate-700 overflow-hidden transition-transform duration-300 hover:scale-105">
              <img
                src={scapeRoomLogo}
                alt="Scape Room Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <h1 className="text-4xl font-black mb-2 tracking-tight text-white">
              Escape Room
            </h1>
            <p className="text-blue-400 font-bold text-xs tracking-widest uppercase mb-4">
              Game Master Console • Administración
            </p>
            <div className="w-12 h-1 bg-slate-600 rounded-full my-6" />
            <p className="text-sm font-medium leading-relaxed text-slate-300 max-w-sm">
              Panel de control centralizado. Accede para gestionar salas,
              monitorear reservas y comunicarte con los jugadores en tiempo
              real.
            </p>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center relative">
          <div className="max-w-sm w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                Acceso al Sistema
              </h2>
              <p className="text-slate-400 font-medium">
                Ingresa tus credenciales de Game Master
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                  Usuario
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-500 transition-colors duration-200 group-focus-within:text-blue-400" />
                  </div>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ej: admin"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold rounded-xl outline-none transition-all duration-200 focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/40 hover:bg-slate-700 hover:border-slate-600 placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-xs font-bold text-blue-400 hover:text-white transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-500 transition-colors duration-200 group-focus-within:text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold rounded-xl outline-none transition-all duration-200 focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/40 hover:bg-slate-700 hover:border-slate-600 placeholder:text-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mensaje de error si falla el login */}
              {errorMsg && (
                <div className="text-red-400 text-xs font-bold text-center mt-2 bg-red-900/20 py-2 rounded-lg border border-red-900/50">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-blue-600 text-white text-base font-bold rounded-xl shadow-[0_10px_20px_-3px_rgba(59,130,246,0.2)] transition-all duration-200 hover:bg-slate-900 hover:-translate-y-0.5 hover:border hover:border-blue-500 hover:text-blue-400 active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed mt-4"
              >
                {isPending ? "Validando sesión..." : "Acceder al Sistema"}
              </button>
            </form>

            <div className="mt-8 text-center absolute bottom-8 left-0 right-0">
              <p className="text-xs text-slate-500 font-medium">
                Escape Room Management System{" "}
                <span className="font-bold text-slate-100">v1.0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
