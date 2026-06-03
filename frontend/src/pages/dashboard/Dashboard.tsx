import { useState } from "react";
import Clientes from "./Clientes/Clientes";
import Empleados from "./Empleados/Empleados";
import Reservas from "./Reservas/Reservas";
import Salas from "./Salas/Salas";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("reservas");

  return (
    <div className="flex flex-col-reverse md:flex-row-reverse w-full mx-auto p-5 md:p-6 gap-5 min-h-[calc(100vh-73px)] bg-slate-50 text-slate-900 font-sans">
      <main className="flex-1 min-w-0">
        {/* ========== SECCIÓN SALAS ========== */}
        <Salas activeSection={activeSection} />

        {/* ========== SECCIÓN CLIENTES ========== */}
        <Clientes activeSection={activeSection} />

        {/* ========== SECCIÓN EMPLEADOS ========== */}
        <Empleados activeSection={activeSection} />

        {/* ========== SECCIÓN RESERVAS ========== */}
        <Reservas activeSection={activeSection} />
      </main>

      {/* SIDEBAR */}
      <nav className="w-full md:w-[200px] shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto">
        {["reservas", "salas", "clientes", "empleados"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`w-full min-h-[44px] border rounded-lg px-4 font-bold text-sm text-center md:text-left transition-colors capitalize
              ${activeSection === tab ? "bg-teal-700 text-white border-teal-800" : "bg-white text-slate-900 border-slate-200 hover:bg-slate-100"}
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
