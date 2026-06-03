import { useState } from "react";
import {
  useBuscarClientes,
  useBuscarEmpleados,
  useBuscarReservas,
  useBuscarSalas,
  useObtenerClienteConReservas,
} from "../../../services/ScapeRoom/useEscapeRoom";

type Tab = "reservas" | "clientes" | "salas" | "empleados";

export default function Busqueda({
  activeSection = "busqueda",
}: {
  readonly activeSection?: string;
}) {
  const [tab, setTab] = useState<Tab>("reservas");

  // Filtros comunes
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filtros de reservas
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [clienteIdFiltro, setClienteIdFiltro] = useState("");
  const [salaIdFiltro, setSalaIdFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  // Filtros de clientes
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");

  // Filtros de salas
  const [nombreSala, setNombreSala] = useState("");
  const [tematicaSala, setTematicaSala] = useState("");

  // Filtros de empleados
  const [rolEmpleado, setRolEmpleado] = useState("");
  const [activoEmpleado, setActivoEmpleado] = useState<string>("");

  // Cliente detalle
  const [clienteDetalleId, setClienteDetalleId] = useState<number | null>(null);

  const reservasParams: Record<string, string | number> = {};
  if (fechaFiltro) reservasParams.fecha = fechaFiltro;
  if (clienteIdFiltro) reservasParams.id_cliente = Number(clienteIdFiltro);
  if (salaIdFiltro) reservasParams.id_sala = Number(salaIdFiltro);
  if (estadoFiltro) reservasParams.estado = estadoFiltro;

  const { data: reservasData, isFetching: loadingReservas } = useBuscarReservas(
    reservasParams,
    page,
    limit,
  );

  const clientesParams: Record<string, string> = {};
  if (nombreCliente) clientesParams.nombre = nombreCliente;
  if (emailCliente) clientesParams.email = emailCliente;

  const { data: clientesData, isFetching: loadingClientes } = useBuscarClientes(
    clientesParams,
    page,
    limit,
  );

  const salasParams: Record<string, string> = {};
  if (nombreSala) salasParams.nombre = nombreSala;
  if (tematicaSala) salasParams.tematica = tematicaSala;

  const { data: salasData, isFetching: loadingSalas } = useBuscarSalas(
    salasParams,
    page,
    limit,
  );

  const empleadosParams: Record<string, string | boolean> = {};
  if (rolEmpleado) empleadosParams.rol = rolEmpleado;
  if (activoEmpleado === "true") empleadosParams.activo = true;
  if (activoEmpleado === "false") empleadosParams.activo = false;

  const { data: empleadosData, isFetching: loadingEmpleados } = useBuscarEmpleados(
    empleadosParams,
    page,
    limit,
  );

  const { data: clienteDetalle } = useObtenerClienteConReservas(clienteDetalleId);

  const paginacion =
    tab === "reservas"
      ? reservasData?.paginacion
      : tab === "clientes"
        ? clientesData?.paginacion
        : tab === "salas"
          ? salasData?.paginacion
          : empleadosData?.paginacion;

  const items =
    tab === "reservas"
      ? reservasData?.items
      : tab === "clientes"
        ? clientesData?.items
        : tab === "salas"
          ? salasData?.items
          : empleadosData?.items;

  const loading =
    tab === "reservas"
      ? loadingReservas
      : tab === "clientes"
        ? loadingClientes
        : tab === "salas"
          ? loadingSalas
          : loadingEmpleados;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "reservas", label: "Reservas" },
    { id: "clientes", label: "Clientes" },
    { id: "salas", label: "Salas" },
    { id: "empleados", label: "Empleados" },
  ];

  return (
    <section className={activeSection === "busqueda" ? "block" : "hidden"}>
      <h2 className="text-xl m-0 mb-4 font-bold">Búsqueda avanzada</h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setPage(1);
              setClienteDetalleId(null);
            }}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
              tab === t.id
                ? "bg-teal-700 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <form
        onSubmit={handleSearch}
        className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4"
      >
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold m-0">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
          {tab === "reservas" && (
            <>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Fecha{" "}
                <input
                  type="date"
                  value={fechaFiltro}
                  onChange={(e) => setFechaFiltro(e.target.value)}
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                ID Cliente{" "}
                <input
                  type="number"
                  value={clienteIdFiltro}
                  onChange={(e) => setClienteIdFiltro(e.target.value)}
                  placeholder="Ej: 1"
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                ID Sala{" "}
                <input
                  type="number"
                  value={salaIdFiltro}
                  onChange={(e) => setSalaIdFiltro(e.target.value)}
                  placeholder="Ej: 1"
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Estado{" "}
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                >
                  <option value="">Todos</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Completada">Completada</option>
                </select>
              </label>
            </>
          )}
          {tab === "clientes" && (
            <>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Nombre{" "}
                <input
                  type="text"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  placeholder="Ej: Ana"
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Email{" "}
                <input
                  type="text"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  placeholder="Ej: ana@test.com"
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
            </>
          )}
          {tab === "salas" && (
            <>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Nombre{" "}
                <input
                  type="text"
                  value={nombreSala}
                  onChange={(e) => setNombreSala(e.target.value)}
                  placeholder="Ej: Cripta"
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Temática{" "}
                <input
                  type="text"
                  value={tematicaSala}
                  onChange={(e) => setTematicaSala(e.target.value)}
                  placeholder="Ej: Terror"
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
            </>
          )}
          {tab === "empleados" && (
            <>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Rol{" "}
                <input
                  type="text"
                  value={rolEmpleado}
                  onChange={(e) => setRolEmpleado(e.target.value)}
                  placeholder="Ej: Game Master"
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">
                Activo{" "}
                <select
                  value={activoEmpleado}
                  onChange={(e) => setActivoEmpleado(e.target.value)}
                  className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal"
                >
                  <option value="">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </label>
            </>
          )}
          <div className="flex items-end">
            <button
              type="submit"
              className="min-h-[36px] px-4 rounded-md bg-teal-700 text-white font-bold text-sm hover:bg-teal-800"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>

      {/* Resultados: Reservas */}
      {tab === "reservas" && (
        <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-base font-bold m-0">Reservas</h3>
            {paginacion && (
              <span className="text-xs text-slate-500">
                Total: {paginacion.total}
              </span>
            )}
          </div>
          {loading ? (
            <div className="p-4 text-slate-500 text-sm">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Sala</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Cliente</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Fecha</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Jugadores</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.length === 0 && (
                    <tr><td colSpan={6} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin resultados</td></tr>
                  )}
                  {items?.map((r: any) => (
                    <tr key={r.id_reserva}>
                      <td className="border-b border-slate-200 px-3 py-2.5">{r.id_reserva}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{r.id_sala}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{r.id_cliente}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{new Date(r.fecha_hora).toLocaleString()}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{r.numero_jugadores}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{r.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Resultados: Clientes */}
      {tab === "clientes" && (
        <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-base font-bold m-0">Clientes</h3>
            {paginacion && (
              <span className="text-xs text-slate-500">Total: {paginacion.total}</span>
            )}
          </div>
          {loading ? (
            <div className="p-4 text-slate-500 text-sm">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Nombre</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Email</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Teléfono</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase"></th>
                  </tr>
                </thead>
                <tbody>
                  {items?.length === 0 && (
                    <tr><td colSpan={5} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin resultados</td></tr>
                  )}
                  {items?.map((c: any) => (
                    <tr key={c.id_cliente}>
                      <td className="border-b border-slate-200 px-3 py-2.5">{c.id_cliente}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{c.nombre} {c.apellido}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{c.email}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{c.telefono || "—"}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">
                        <button
                          onClick={() => setClienteDetalleId(c.id_cliente)}
                          className="text-xs px-2.5 py-1 rounded bg-teal-700 text-white font-bold hover:bg-teal-800"
                        >
                          Ver reservas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detalle del cliente con reservas */}
      {clienteDetalle && (
        <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-base font-bold m-0">
              {clienteDetalle.nombre} {clienteDetalle.apellido} — Reservas
            </h3>
            <button
              onClick={() => setClienteDetalleId(null)}
              className="text-xs px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
            >
              Cerrar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID Reserva</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Sala</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Fecha</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Jugadores</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Total</th>
                  <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {clienteDetalle.reservas.length === 0 && (
                  <tr><td colSpan={6} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin reservas</td></tr>
                )}
                {clienteDetalle.reservas.map((r: any) => (
                  <tr key={r.id_reserva}>
                    <td className="border-b border-slate-200 px-3 py-2.5">{r.id_reserva}</td>
                    <td className="border-b border-slate-200 px-3 py-2.5">{r.id_sala}</td>
                    <td className="border-b border-slate-200 px-3 py-2.5">{new Date(r.fecha_hora).toLocaleString()}</td>
                    <td className="border-b border-slate-200 px-3 py-2.5">{r.numero_jugadores}</td>
                    <td className="border-b border-slate-200 px-3 py-2.5">{r.total_pagado}</td>
                    <td className="border-b border-slate-200 px-3 py-2.5">{r.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resultados: Salas */}
      {tab === "salas" && (
        <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-base font-bold m-0">Salas</h3>
            {paginacion && (
              <span className="text-xs text-slate-500">Total: {paginacion.total}</span>
            )}
          </div>
          {loading ? (
            <div className="p-4 text-slate-500 text-sm">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Nombre</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Temática</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Dificultad</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Capacidad</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.length === 0 && (
                    <tr><td colSpan={6} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin resultados</td></tr>
                  )}
                  {items?.map((s: any) => (
                    <tr key={s.id_sala}>
                      <td className="border-b border-slate-200 px-3 py-2.5">{s.id_sala}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{s.nombre}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{s.tematica}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{s.dificultad || "—"}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{s.capacidad_max}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">${s.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Resultados: Empleados */}
      {tab === "empleados" && (
        <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-base font-bold m-0">Empleados</h3>
            {paginacion && (
              <span className="text-xs text-slate-500">Total: {paginacion.total}</span>
            )}
          </div>
          {loading ? (
            <div className="p-4 text-slate-500 text-sm">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Nombre</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Rol</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.length === 0 && (
                    <tr><td colSpan={4} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin resultados</td></tr>
                  )}
                  {items?.map((e: any) => (
                    <tr key={e.id_empleado}>
                      <td className="border-b border-slate-200 px-3 py-2.5">{e.id_empleado}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{e.nombre} {e.apellido}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{e.rol}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5">{e.activo ? "Sí" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Paginación */}
      {paginacion && paginacion.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 my-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
          >
            Anterior
          </button>
          {Array.from({ length: paginacion.total_pages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-sm rounded border ${
                  p === page
                    ? "bg-teal-700 text-white border-teal-700"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            disabled={page >= paginacion.total_pages}
            onClick={() => setPage((p) => Math.min(paginacion.total_pages, p + 1))}
            className="px-3 py-1.5 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
