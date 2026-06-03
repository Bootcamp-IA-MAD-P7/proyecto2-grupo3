import { Briefcase, CalendarDays, Key, LogOut, Search, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { TokenStorage } from "../../../services/General/Storage/TokenStorage";

const DASHBOARD_ITEMS = [
  {
    id: "reservas",
    label: "Reservas",
    path: ROUTES.APP.MAIN,
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    id: "salas",
    label: "Salas",
    path: ROUTES.APP.ROOMS,
    icon: <Key className="w-5 h-5" />,
  },
  {
    id: "clientes",
    label: "Clientes",
    path: ROUTES.APP.CLIENTS,
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "empleados",
    label: "Empleados",
    path: ROUTES.APP.EMPLOYEES,
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: "busqueda",
    label: "Búsqueda",
    path: ROUTES.APP.SEARCH,
    icon: <Search className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    TokenStorage.clearSession();
    navigate(ROUTES.AUTH.LOGIN);
  };

  return (
    <aside className="w-[260px] bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0 shadow-xl z-20">
      {/* TÍTULO / LOGO DEL SIDEBAR */}
      <div className="h-17 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-teal-900/50">
          <Key className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-black text-white leading-tight tracking-wide">
            Factoría
          </h1>
          <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">
            Escape Room
          </p>
        </div>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Módulos
        </p>

        {DASHBOARD_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            // NavLink detecta automáticamente si la ruta está activa
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-teal-600 text-white shadow-[0_4px_15px_-3px_rgba(15,118,110,0.5)]"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* BOTÓN DE LOGOUT */}
      <div className="p-4 py-2 border-t border-slate-800 bg-slate-950/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
