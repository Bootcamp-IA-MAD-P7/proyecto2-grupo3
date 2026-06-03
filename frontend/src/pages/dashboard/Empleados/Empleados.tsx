import { Briefcase, Save, X } from "lucide-react";
import { useState } from "react";
import type { ColumnDef } from "../../../components/common/DataTable/DataTable";
import DataTable from "../../../components/common/DataTable/DataTable";
import {
  useActualizarEmpleado,
  useCrearEmpleado,
  useEliminarEmpleado,
  useObtenerEmpleados,
} from "../../../services/ScapeRoom/useEscapeRoom";
import { toArray } from "../../../utils/toArray";

interface EmpleadoForm {
  id_empleado?: number;
  nombre: string;
  apellido: string;
  rol: string;
}

export default function Empleados() {
  const empleadosQuery = useObtenerEmpleados();
  const empleados = toArray(empleadosQuery.data);
  const isLoading = empleadosQuery.isLoading;
  const { mutate: crearEmpleado, isPending: isCreating } = useCrearEmpleado();
  const { mutate: actualizarEmpleado, isPending: isUpdating } =
    useActualizarEmpleado();
  const { mutate: eliminarEmpleado } = useEliminarEmpleado();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<EmpleadoForm | null>(null);

  const openModalNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };
  const openModalEdit = (empleado: EmpleadoForm) => {
    setEditingData(empleado);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: String(formData.get("nombre")),
      apellido: String(formData.get("apellido")),
      rol: String(formData.get("rol")),
    };

    if (editingData?.id_empleado) {
      actualizarEmpleado(
        { id: editingData.id_empleado, data },
        { onSuccess: closeModal },
      );
    } else {
      crearEmpleado(data, { onSuccess: closeModal });
    }
  };

  const handleExportCSV = () => {
    if (!empleados.length) return;
    const headers = ["ID", "NOMBRE", "APELLIDO", "ROL"];
    const csvContent = [
      headers.join(","),
      ...empleados.map(
        (e) => `${e.id_empleado},${e.nombre},${e.apellido},${e.rol}`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `empleados_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef[] = [
    { header: "ID", accessorKey: "id_empleado", className: "font-medium" },
    {
      header: "Nombre Completo",
      cell: (row) => (
        <div className="text-sm font-bold text-slate-800">
          {row.nombre} {row.apellido}
        </div>
      ),
    },
    {
      header: "Rol Asignado",
      cell: (row) => (
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
          {row.rol}
        </span>
      ),
    },
    {
      header: "Estado",
      className: "text-center",
      cell: () => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
          ACTIVO
        </span>
      ),
    },
  ];

  const handleDelete = (row: EmpleadoForm) => {
    eliminarEmpleado(row.id_empleado!);
  };

  return (
    <div className="w-full flex flex-col animate-fade-in">
      <DataTable
        title="Mantenimiento de Empleados"
        subtitle="Equipo Gestionado"
        ButtonNewText="NUEVO EMPLEADO"
        data={empleados}
        columns={columns}
        searchFields={["nombre", "apellido", "rol"]}
        idKey="id_empleado"
        isLoading={isLoading}
        handleExportCSV={handleExportCSV}
        openModalNew={openModalNew}
        openModalEdit={openModalEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-md">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">
                    {editingData ? "Editar Empleado" : "Nuevo Empleado"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Configuración de Personal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Nombre del Empleado <span className="text-red-500">*</span>
                </label>
                <input
                  name="nombre"
                  required
                  defaultValue={editingData?.nombre}
                  placeholder="Ej: Carlos"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  name="apellido"
                  required
                  defaultValue={editingData?.apellido}
                  placeholder="Ej: Martín"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Rol Asignado <span className="text-red-500">*</span>
                </label>
                <select
                  name="rol"
                  defaultValue={editingData?.rol || "Game Master"}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                >
                  <option value="Game Master">Game Master</option>
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />{" "}
                  {isCreating || isUpdating ? "GUARDANDO..." : "GUARDAR DATOS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
