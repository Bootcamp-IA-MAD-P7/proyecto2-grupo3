import {
  useCrearEmpleado,
  useEliminarEmpleado,
  useObtenerEmpleados
} from "../../../services/ScapeRoom/useEscapeRoom";

interface EmpleadosProps {
  readonly activeSection: string;
}
export default function Empleados({ activeSection }: EmpleadosProps) {
  const { data: empleados } = useObtenerEmpleados();
  const { mutate: crearEmpleado } = useCrearEmpleado();
  const { mutate: eliminarEmpleado } = useEliminarEmpleado();

  const handleCrearEmpleado = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    crearEmpleado({
      nombre: String(formData.get("nombre") ?? ""),
      apellido: String(formData.get("apellido") ?? ""),
      rol: String(formData.get("rol") ?? ""),
    });
    e.currentTarget.reset();
  };

  return (
    <section className={activeSection === "empleados" ? "block" : "hidden"}>
      <h2 className="text-xl m-0 mb-4 font-bold">Gestión de Empleados</h2>

      <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold m-0">Crear empleado</h3>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4"
          onSubmit={handleCrearEmpleado}
        >
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Nombre{" "}
            <input
              name="nombre"
              required
              maxLength={20}
              placeholder="Carlos"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Apellido{" "}
            <input
              name="apellido"
              required
              maxLength={20}
              placeholder="Martín"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Rol
            <select
              name="rol"
              defaultValue="Game Master"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            >
              <option value="Game Master">Game Master</option>
              <option value="Recepcionista">Recepcionista</option>
              <option value="Gerente">Gerente</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </label>
          <button
            type="submit"
            className="self-end min-h-[38px] rounded-md px-3.5 bg-teal-700 text-white font-bold text-sm hover:bg-teal-800"
          >
            Crear empleado
          </button>
        </form>
      </div>

      <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold m-0">Empleados registrados</h3>
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
                  Rol
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {empleados?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="border-b border-slate-200 px-3 py-2.5 text-slate-500"
                  >
                    Sin empleados registrados
                  </td>
                </tr>
              )}
              {empleados?.map((e) => (
                <tr key={e.id_empleado}>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {e.id_empleado}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {e.nombre} {e.apellido}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {e.rol}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => eliminarEmpleado(e.id_empleado)}
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
