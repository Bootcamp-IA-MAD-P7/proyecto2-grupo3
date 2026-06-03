import {
  useCrearCliente,
  useEliminarCliente,
  useObtenerClientes,
} from "../../../services/ScapeRoom/useEscapeRoom";

interface ClientesProps {
  readonly activeSection: string;
}
export default function Clientes({ activeSection }: ClientesProps) {
  const { data: clientes } = useObtenerClientes();
  const { mutate: crearCliente } = useCrearCliente();
  const { mutate: eliminarCliente } = useEliminarCliente();

  const handleCrearCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    crearCliente({
      nombre: String(formData.get("nombre") ?? ""),
      apellido: String(formData.get("apellido") ?? ""),
      email: String(formData.get("email") ?? ""),
      telefono: String(formData.get("telefono") ?? ""),
    });
    e.currentTarget.reset();
  };

  return (
    <section className={activeSection === "clientes" ? "block" : "hidden"}>
      <h2 className="text-xl m-0 mb-4 font-bold">Gestión de Clientes</h2>

      <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold m-0">Crear cliente</h3>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4"
          onSubmit={handleCrearCliente}
        >
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Nombre{" "}
            <input
              name="nombre"
              required
              maxLength={20}
              placeholder="Ana"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Apellido{" "}
            <input
              name="apellido"
              required
              maxLength={20}
              placeholder="López"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Email{" "}
            <input
              name="email"
              type="email"
              required
              maxLength={50}
              placeholder="ana@test.io"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Teléfono{" "}
            <input
              name="telefono"
              maxLength={20}
              placeholder="600000000"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <button
            type="submit"
            className="self-end min-h-[38px] rounded-md px-3.5 bg-teal-700 text-white font-bold text-sm hover:bg-teal-800"
          >
            Crear cliente
          </button>
        </form>
      </div>

      <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold m-0">Clientes registrados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">
                  ID
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">
                  Nombre
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">
                  Email
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">
                  Teléfono
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {clientes?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="border-b border-slate-200 px-3 py-2.5 text-slate-500"
                  >
                    Sin clientes registrados
                  </td>
                </tr>
              )}
              {clientes?.map((c) => (
                <tr key={c.id_cliente}>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {c.id_cliente}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {c.nombre} {c.apellido}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {c.email}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {c.telefono || "—"}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => eliminarCliente(c.id_cliente)}
                      className="min-h-[30px] min-w-[60px] text-xs px-2.5 rounded bg-red-700 text-white font-bold hover:bg-red-800"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
