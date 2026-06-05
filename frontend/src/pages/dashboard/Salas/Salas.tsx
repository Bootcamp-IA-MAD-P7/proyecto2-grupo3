import { Key, Save, X } from "lucide-react";
import { useState } from "react";
import type { ColumnDef } from "../../../components/common/DataTable/DataTable";
import DataTable from "../../../components/common/DataTable/DataTable";
import {
  useActualizarSala,
  useCrearSala,
  useEliminarSala,
  useObtenerSalas,
} from "../../../services/ScapeRoom/useEscapeRoom";

interface SalaForm {
  id_sala?: number;
  nombre: string;
  tematica: string;
  dificultad: string;
  capacidad_max: number;
  precio: number;
}

export default function Salas() {
  const { data: salas, isLoading } = useObtenerSalas();
  const { mutate: crearSala, isPending: isCreating } = useCrearSala();
  const { mutate: actualizarSala, isPending: isUpdating } = useActualizarSala();
  const { mutate: eliminarSala } = useEliminarSala();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<SalaForm | null>(null);

  const openModalNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };
  const openModalEdit = (sala: SalaForm) => {
    setEditingData(sala);
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
      tematica: String(formData.get("tematica")),
      dificultad: String(formData.get("dificultad")),
      capacidad_max: Number(formData.get("capacidad_max")),
      precio: Number(formData.get("precio")),
    };

    if (editingData?.id_sala) {
      actualizarSala(
        { id: editingData.id_sala, data },
        { onSuccess: closeModal },
      );
    } else {
      crearSala(data, { onSuccess: closeModal });
    }
  };

  const handleExportCSV = () => {
    if (!salas?.length) return;
    const headers = [
      "ID",
      "NOMBRE",
      "TEMATICA",
      "DIFICULTAD",
      "CAPACIDAD",
      "PRECIO",
    ];
    const csvContent = [
      headers.join(","),
      ...salas.map(
        (s) =>
          `${s.id_sala},"${s.nombre}","${s.tematica}",${s.dificultad},${s.capacidad_max},${s.precio}`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `salas_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(Number(v ?? 0));

  const columns: ColumnDef[] = [
    { header: "ID", accessorKey: "id_sala", className: "font-medium" },
    {
      header: "Nombre",
      cell: (row) => (
        <div className="text-sm font-bold text-slate-800">{row.nombre}</div>
      ),
    },
    { header: "Temática", accessorKey: "tematica" },
    {
      header: "Dificultad",
      cell: (row) => {
        const colors: Record<string, string> = {
          Fácil: "bg-green-100 text-green-700 border-green-200",
          Medio: "bg-yellow-100 text-yellow-700 border-yellow-200",
          Difícil: "bg-orange-100 text-orange-700 border-orange-200",
          Experto: "bg-red-100 text-red-700 border-red-200",
        };
        const colorClass =
          colors[row.dificultad] ||
          "bg-slate-100 text-slate-700 border-slate-200";
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border ${colorClass}`}
          >
            {row.dificultad}
          </span>
        );
      },
    },
    {
      header: "Capacidad",
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-xs">{row.capacidad_max} pax</span>
      ),
    },
    {
      header: "Precio",
      cell: (row) => (
        <span className="text-sm font-bold text-slate-700">
          {formatCurrency(row.precio)}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col animate-fade-in">
      <DataTable
        title="Catálogo de Salas"
        subtitle="Entornos de Juego"
        ButtonNewText="NUEVA SALA"
        data={salas || []}
        columns={columns}
        searchFields={["nombre", "tematica", "dificultad"]}
        idKey="id_sala"
        isLoading={isLoading}
        handleExportCSV={handleExportCSV}
        openModalNew={openModalNew}
        openModalEdit={openModalEdit}
        onDelete={eliminarSala}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-md">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">
                    {editingData ? "Editar Sala" : "Nueva Sala"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Configuración de Entorno
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Nombre de la Sala <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nombre"
                    required
                    defaultValue={editingData?.nombre}
                    maxLength={100}
                    placeholder="Ej: La Cripta"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Temática <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="tematica"
                    required
                    defaultValue={editingData?.tematica}
                    maxLength={100}
                    placeholder="Ej: Misterio / Terror"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Dificultad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="dificultad"
                    defaultValue={editingData?.dificultad || "Medio"}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none cursor-pointer"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Medio">Medio</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Experto">Experto</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Capacidad Max. <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="capacidad_max"
                    type="number"
                    min="1"
                    required
                    onKeyDown={(e) => {
                      // Previene teclear el símbolo menos, la 'e' de exponente y decimales
                      if (['-', 'e', 'E', '+', '.', ','].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    defaultValue={editingData?.capacidad_max || 6}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Precio Base (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    onKeyDown={(e) => {
                      // Previene teclear el símbolo menos y la 'e' de exponente (permite decimales)
                      if (['-', 'e', 'E', '+'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    defaultValue={editingData?.precio || 50}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl disabled:opacity-70 cursor-pointer"
                >
                  <Save className="w-4 h-4 pointer-events-none" />{" "}
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