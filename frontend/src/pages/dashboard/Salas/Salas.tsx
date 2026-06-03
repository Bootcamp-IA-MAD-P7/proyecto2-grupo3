import {
  useCrearSala,
  useEliminarSala,
  useObtenerSalas
} from "../../../services/ScapeRoom/useEscapeRoom";

interface SalasProps {
  readonly activeSection: string;
}
export default function Salas({ activeSection }: SalasProps) {
  const { data: salas } = useObtenerSalas();
  const { mutate: crearSala } = useCrearSala();
  const { mutate: eliminarSala } = useEliminarSala();

  const handleCrearSala = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    crearSala({
      nombre: String(formData.get("nombre") ?? ""),
      tematica: String(formData.get("tematica") ?? ""),
      dificultad: String(formData.get("dificultad") ?? ""),
      capacidad_max: Number(formData.get("capacidad_max")),
      precio: Number(formData.get("precio")),
    });
    e.currentTarget.reset();
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(Number(v ?? 0));

  return (
    <section className={activeSection === "salas" ? "block" : "hidden"}>
      <h2 className="text-xl m-0 mb-4 font-bold">Gestión de Salas</h2>

      <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold m-0">Crear sala</h3>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4"
          onSubmit={handleCrearSala}
        >
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Nombre
            <input
              name="nombre"
              required
              maxLength={100}
              placeholder="La cripta"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Temática
            <input
              name="tematica"
              required
              maxLength={100}
              placeholder="Misterio"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Dificultad
            <select
              name="dificultad"
              defaultValue="Medio"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            >
              <option value="Fácil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Difícil">Difícil</option>
              <option value="Experto">Experto</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Capacidad máxima
            <input
              name="capacidad_max"
              type="number"
              min="1"
              required
              defaultValue="6"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
            Precio (€)
            <input
              name="precio"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue="50"
              className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
            />
          </label>
          <button
            type="submit"
            className="self-end min-h-[38px] rounded-md px-3.5 bg-teal-700 text-white font-bold text-sm hover:bg-teal-800"
          >
            Crear sala
          </button>
        </form>
      </div>

      <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold m-0">Salas registradas</h3>
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
                  Temática
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">
                  Dificultad
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">
                  Capacidad
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">
                  Precio
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {salas?.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="border-b border-slate-200 px-3 py-2.5 text-slate-500"
                  >
                    Sin salas registradas
                  </td>
                </tr>
              )}
              {salas?.map((s) => (
                <tr key={s.id_sala}>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {s.id_sala}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {s.nombre}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {s.tematica}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {s.dificultad}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {s.capacidad_max}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    {formatCurrency(s.precio)}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => eliminarSala(s.id_sala)}
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
