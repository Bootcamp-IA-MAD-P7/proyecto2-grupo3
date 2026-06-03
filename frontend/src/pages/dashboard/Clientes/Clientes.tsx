import { X } from "lucide-react";
import { useState } from "react";
import type { ColumnDef } from "../../../components/common/DataTable/DataTable";
import DataTable from "../../../components/common/DataTable/DataTable";
import {
  useActualizarCliente,
  useCrearCliente,
  useEliminarCliente,
  useObtenerClientes,
} from "../../../services/ScapeRoom/useEscapeRoom";
import { toArray } from "../../../utils/toArray";

interface ClienteForm {
  id_cliente?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

interface ClientesProps {
  readonly activeSection?: string;
}

export default function Clientes({
  activeSection = "clientes",
}: ClientesProps) {
  const clientesQuery = useObtenerClientes();
  const clientes = toArray(clientesQuery.data);
  const isLoading = clientesQuery.isLoading;
  const { mutate: crearCliente, isPending: isCreating } = useCrearCliente();
  const { mutate: actualizarCliente, isPending: isUpdating } =
    useActualizarCliente();
  const { mutate: eliminarCliente } = useEliminarCliente();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<ClienteForm | null>(null);

  const openModalNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const openModalEdit = (cliente: ClienteForm) => {
    setEditingData(cliente);
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
      email: String(formData.get("email")),
      telefono: String(formData.get("telefono")),
    };

    if (editingData?.id_cliente) {
      actualizarCliente(
        { id: editingData.id_cliente, data },
        { onSuccess: closeModal },
      );
    } else {
      crearCliente(data, { onSuccess: closeModal });
    }
  };

  const columns: ColumnDef[] = [
    { header: "ID", accessorKey: "id_cliente", className: "font-medium" },
    {
      header: "Nombre Completo",
      cell: (row) => (
        <div className="text-sm font-bold text-slate-800">
          {row.nombre} {row.apellido}
        </div>
      ),
    },
    { header: "Email", accessorKey: "email" },
    { header: "Teléfono", accessorKey: "telefono" },
  ];

  const handleExportCSV = () => {
    if (!clientes.length) return;
    const headers = ["ID", "NOMBRE", "APELLIDO", "EMAIL", "TELEFONO"];
    const csvContent = [
      headers.join(","),
      ...clientes.map(
        (c) =>
          `${c.id_cliente},${c.nombre},${c.apellido},${c.email},${c.telefono}`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `clientes_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      className={
        activeSection === "clientes" ? "block animate-fade-in" : "hidden"
      }
    >
      <DataTable
        title="Gestión de Clientes"
        subtitle="Base de datos de clientes"
        ButtonNewText="NUEVO CLIENTE"
        data={clientes}
        columns={columns}
        searchFields={["nombre", "apellido", "email"]}
        idKey="id_cliente"
        isLoading={isLoading}
        openModalNew={openModalNew}
        openModalEdit={openModalEdit}
        onDelete={(row) => eliminarCliente(row.id_cliente)}
        handleExportCSV={handleExportCSV}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
                {editingData ? "Editar Cliente" : "Nuevo Cliente"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {["nombre", "apellido", "email", "telefono"].map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    {field} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name={field}
                    required={field !== "telefono"}
                    defaultValue={editingData?.[field as keyof ClienteForm]}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:border-teal-500"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl"
                >
                  {isCreating || isUpdating ? "GUARDANDO..." : "GUARDAR DATOS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
