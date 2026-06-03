import { CalendarClock, Pencil, Play, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "../../../constants/routes";
import type { ColumnDef } from "../../../components/common/DataTable/DataTable";
import DataTable from "../../../components/common/DataTable/DataTable";
import {
  useActualizarReserva,
  useCrearReserva,
  useEliminarReserva,
  useObtenerClientes,
  useObtenerDisponibilidad,
  useObtenerReservas,
  useObtenerSalas,
} from "../../../services/ScapeRoom/useEscapeRoom";
import { toArray } from "../../../utils/toArray";

interface ReservaForm {
  id_reserva?: number;
  id_sala: number;
  id_cliente: number;
  id_empleado: number | null;
  fecha_hora: string;
  numero_jugadores: number;
  total_pagado: number;
  estado?: string;
}

interface ReservasProps {
  readonly activeSection?: string;
}

export default function Reservas({
  activeSection = "reservas",
}: ReservasProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<ReservaForm | null>(null);

  // Calendario / slots dentro del modal
  const [calDate, setCalDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSalaId, setSelectedSalaId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reservaTotal, setReservaTotal] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const salas = toArray(useObtenerSalas().data);
  const clientes = toArray(useObtenerClientes().data);
  const reservas = toArray(useObtenerReservas().data);
  const { mutate: crearReserva } = useCrearReserva();
  const { mutate: actualizarReserva } = useActualizarReserva();
  const { mutate: eliminarReserva } = useEliminarReserva();

  const fechaStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const { data: disponibilidad } = useObtenerDisponibilidad(
    selectedSalaId,
    fechaStr,
  );

  // ── Reservas del día actual ────────────────────────────────────────
  const todayStr = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, "0")}-${String(currentTime.getDate()).padStart(2, "0")}`;

  const reservasHoy = useMemo(() => {
    return reservas.filter((r) => {
      const ds = r.fecha_hora as string;
      return ds.substring(0, 10) === todayStr;
    });
  }, [reservas, todayStr]);

  // ── Helpers ────────────────────────────────────────────────────────
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(Number(v ?? 0));

  const nombreSala = (id: number) =>
    salas.find((s) => s.id_sala === id)?.nombre ?? `Sala #${id}`;

  const nombreCliente = (id: number) => {
    const c = clientes.find((cl) => cl.id_cliente === id);
    return c ? `${c.nombre} ${c.apellido}` : `Cliente #${id}`;
  };

  const abrirSala = (salaId: number) => {
    window.open(`${ROUTES.APP.GAME_MASTER_PANEL}${salaId}`, "_blank");
    setTimeout(() => {
      window.open(`${ROUTES.APP.ESCAPE_ROOM}${salaId}`, "_blank");
    }, 100);
  };

  // ── CSV ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (!reservasHoy.length) return;
    const headers = ["ID", "SALA", "CLIENTE", "FECHA Y HORA", "JUGADORES", "PAGADO", "ESTADO"];
    const rows = reservasHoy.map((r) => {
        const ds = String(r.fecha_hora);
        const parts = ds.replace("T", " ").substring(0, 16).split(/[\s-:T]/);
        const display = `${parts[2]}/${parts[1]}/${parts[0]} ${parts[3]}:${parts[4]}`;
        return [r.id_reserva, nombreSala(r.id_sala), nombreCliente(r.id_cliente),
          display,
          r.numero_jugadores, r.total_pagado, r.estado ?? "Confirmada"].join(",");
      });
    const blob = new Blob([headers.join(",") + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reservas_${todayStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Calendario ─────────────────────────────────────────────────────
  const renderDays = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = date.toDateString() === currentTime.toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <div
          key={d}
          onClick={() => !isPast && setSelectedDate(date)}
          className={`aspect-square flex items-center justify-center rounded-md text-[13px] font-semibold border transition-colors 
            ${isPast ? "opacity-30 cursor-not-allowed border-transparent bg-slate-50" : "cursor-pointer hover:border-teal-700 bg-slate-50 border-transparent"} 
            ${isSelected ? "!bg-teal-700 !text-white !border-teal-800" : "text-slate-900"}
            ${isToday && !isSelected ? "ring-2 ring-teal-400" : ""}
          `}
        >
          {d}
        </div>,
      );
    }
    return days;
  };

  // ── Modal ──────────────────────────────────────────────────────────
  const openModalNew = () => {
    setEditingData(null);
    setSelectedSalaId(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setReservaTotal(0);
    setCalDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    setIsModalOpen(true);
  };

  const openModalEdit = (reserva: ReservaForm) => {
    setEditingData(reserva);
    const sala = salas.find((s) => s.id_sala === reserva.id_sala);
    setSelectedSalaId(reserva.id_sala);
    setReservaTotal(sala ? Number(sala.precio) * 0.5 : 0);
    const ds = String(reserva.fecha_hora);
    const p = ds.replace("T", " ").substring(0, 16).split(/[\s-:T]/);
    const fecha = new Date(
      Number(p[0]),
      Number(p[1]) - 1,
      Number(p[2]),
      Number(p[3]),
      Number(p[4]),
    );
    setSelectedDate(fecha);
    setCalDate(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
    setSelectedSlot(`${p[3]}:${p[4]}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
    setSelectedSalaId(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleSubmitModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!selectedSalaId || !selectedDate || !selectedSlot)
      return alert("Selecciona sala, fecha y hora");

    const fechaHora = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}T${selectedSlot}:00`;

    // Validar que no sea en el pasado si es el día de hoy
    const fechaReserva = new Date(fechaHora);
    if (fechaReserva <= currentTime) {
      return alert("No se pueden crear reservas en horarios pasados.");
    }

    const payload = {
      id_sala: Number(formData.get("id_sala")),
      id_cliente: Number(formData.get("id_cliente")),
      id_empleado: editingData?.id_empleado ?? null,
      fecha_hora: fechaHora,
      numero_jugadores: Number(formData.get("numero_jugadores")),
      total_pagado: Number(formData.get("total_pagado")),
    };

    if (editingData?.id_reserva) {
      actualizarReserva(
        { id: editingData.id_reserva, data: payload },
        { onSuccess: closeModal },
      );
    } else {
      crearReserva(payload, { onSuccess: closeModal });
    }
  };

  // ── Columnas DataTable ─────────────────────────────────────────────
  const columns: ColumnDef[] = [
    { header: "ID", accessorKey: "id_reserva", className: "font-medium" },
    {
      header: "Sala",
      cell: (row) => (
        <div className="text-sm font-bold text-slate-800">{nombreSala(row.id_sala)}</div>
      ),
    },
    {
      header: "Cliente",
      cell: (row) => (
        <div className="text-sm text-slate-700">{nombreCliente(row.id_cliente)}</div>
      ),
    },
    {
      header: "Fecha y Hora",
      cell: (row) => {
        const ds = String(row.fecha_hora);
        const parts = ds.replace("T", " ").substring(0, 16).split(/[\s-:T]/);
        const display = `${parts[2]}/${parts[1]}/${parts[0]}, ${parts[3]}:${parts[4]}`;
        return <span className="text-sm whitespace-nowrap">{display}</span>;
      },
    },
    {
      header: "Jugadores",
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-xs">{row.numero_jugadores}</span>
      ),
    },
    {
      header: "Pagado",
      cell: (row) => (
        <span className="text-sm font-bold text-slate-700">{formatCurrency(row.total_pagado)}</span>
      ),
    },
    {
      header: "Estado",
      cell: (row) => {
        const activa = isReservaActiva(row.fecha_hora);
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border
            ${activa ? "bg-green-100 text-green-700 border-green-200" :
              row.estado === "Anulada" ? "bg-red-100 text-red-700 border-red-200" :
              "bg-slate-100 text-slate-600 border-slate-200"}`}
          >
            {row.estado === "Anulada" ? "Anulada" : activa ? "En curso" : "Programada"}
          </span>
        );
      },
    },
  ];

  const isReservaActiva = (fechaHora: string) => {
    const ds = String(fechaHora);
    const parts = ds.replace("T", " ").substring(0, 16).split(/[\s-:T]/);
    const inicio = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
      Number(parts[3]),
      Number(parts[4]),
    ).getTime();
    const fin = inicio + 60 * 60 * 1000;
    const ahora = currentTime.getTime();
    return ahora >= inicio && ahora <= fin;
  };

  // ── Acciones custom: Anular / Editar / Abrir Sala ─────────────────
  const actionsColumn = (row: any) => {
    const activa = isReservaActiva(row.fecha_hora);
    return (
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => eliminarReserva(row.id_reserva)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
          title="Anular"
        >
          <Trash2 className="w-4 h-4 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={() => openModalEdit(row)}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
          title="Editar"
        >
          <Pencil className="w-4 h-4 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={() => abrirSala(row.id_sala)}
          title="Abrir sala"
          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
        >
          <Play className="w-4 h-4 pointer-events-none" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col animate-fade-in">
      {/* ── Header con reloj ───────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
          Gestión de Reservas
        </h2>
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-mono text-sm shadow-md">
          <CalendarClock className="w-4 h-4 text-teal-400" />
          {currentTime.toLocaleString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>

      {/* ── Resumen del día ────────────────────────────── */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold text-[10px] tracking-wider uppercase border border-blue-100">
            <CalendarClock className="w-3 h-3" /> Reservas del día
          </div>
          <span className="text-xs font-bold text-slate-500">
            {reservasHoy.length} reserva{reservasHoy.length !== 1 ? "s" : ""} programada{reservasHoy.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── DataTable ──────────────────────────────────── */}
      <DataTable
        title=""
        subtitle={`Reservas · ${currentTime.toLocaleDateString("es-ES")}`}
        ButtonNewText="NUEVA RESERVA"
        data={reservasHoy}
        columns={columns}
        searchFields={["id_reserva"]}
        idKey="id_reserva"
        isLoading={false}
        handleExportCSV={handleExportCSV}
        openModalNew={openModalNew}
        openModalEdit={openModalEdit}
        onDelete={(row) => eliminarReserva(row.id_reserva)}
        actions={actionsColumn}
      />

      {/* ── Modal Nueva / Editar Reserva ──────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-md">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">
                    {editingData ? "Editar Reserva" : "Nueva Reserva"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Configuración de Reserva
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

            <form onSubmit={handleSubmitModal} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Sala */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Sala <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="id_sala"
                    required
                    defaultValue={editingData?.id_sala || ""}
                    onChange={(e) => {
                      const s = salas.find((x) => x.id_sala === Number(e.target.value));
                      setSelectedSalaId(s ? s.id_sala : null);
                      setReservaTotal(s ? Number(s.precio) * 0.5 : 0);
                      setSelectedDate(null);
                      setSelectedSlot(null);
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none cursor-pointer"
                  >
                    <option value="">— Selecciona una sala —</option>
                    {salas.map((s) => (
                      <option key={s.id_sala} value={s.id_sala}>
                        {s.nombre} — {formatCurrency(Number(s.precio))}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cliente */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="id_cliente"
                    required
                    defaultValue={editingData?.id_cliente || ""}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none cursor-pointer"
                  >
                    <option value="">— Selecciona un cliente —</option>
                    {clientes.map((c) => (
                      <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre} {c.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jugadores */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Jugadores <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="numero_jugadores"
                    type="number"
                    min="2"
                    max="6"
                    required
                    defaultValue={editingData?.numero_jugadores || 4}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:border-teal-500 outline-none"
                  />
                </div>

                {/* Total pagado */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Monto (50% del precio)
                  </label>
                  <input
                    name="total_pagado"
                    type="number"
                    readOnly
                    value={reservaTotal}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium cursor-default"
                  />
                </div>
              </div>

              {/* ── Calendario inline ─────────────────────── */}
              {selectedSalaId && (
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3 font-bold text-sm text-slate-700">
                    <button
                      type="button"
                      onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))}
                      className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-lg leading-none cursor-pointer"
                    >
                      &lsaquo;
                    </button>
                    <span className="capitalize">
                      {calDate.toLocaleString("es-ES", { month: "long", year: "numeric" })}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))}
                      className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-lg leading-none cursor-pointer"
                    >
                      &rsaquo;
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                      <div key={d} className="text-center text-[11px] font-bold text-slate-500 py-1">{d}</div>
                    ))}
                    {renderDays()}
                  </div>
                </div>
              )}

              {/* ── Slots de hora ─────────────────────────── */}
              {selectedDate && (
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">
                      Horarios — {selectedDate.toLocaleDateString("es-ES")}
                    </span>
                    <div className="flex gap-3 text-[12px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-100 border border-green-800" /> Libre
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-700" /> Ocupado
                      </span>
                    </div>
                  </div>
                  {disponibilidad?.slots?.length === 0 ? (
                    <p className="text-slate-500 text-sm italic m-0">Sin horarios disponibles.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {disponibilidad?.slots?.map((slot, idx) => {
                        const isSelected = selectedSlot === slot.hora_inicio;
                        const isAvailable = slot.disponible;
                        const isPast = selectedDate.toDateString() === currentTime.toDateString() && (() => {
                          const dtStr = `${fechaStr}T${slot.hora_inicio}:00`;
                          const p = dtStr.replace("T", " ").substring(0, 16).split(/[\s-:T]/);
                          const slotDt = new Date(
                            Number(p[0]), Number(p[1]) - 1, Number(p[2]),
                            Number(p[3]), Number(p[4]),
                          );
                          return slotDt <= currentTime;
                        })();

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!isAvailable || isPast}
                            onClick={() => setSelectedSlot(slot.hora_inicio)}
                            className={`min-h-[38px] min-w-[80px] border rounded-md px-3 font-bold text-[13px] transition-colors
                              ${!isAvailable || isPast
                                ? "bg-red-100 text-red-700 border-red-200 opacity-60 cursor-not-allowed"
                                : isSelected
                                  ? "bg-teal-700 text-white border-teal-800"
                                  : "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-800"
                              }`}
                          >
                            {slot.hora_inicio}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Botones */}
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
                  disabled={!selectedSlot}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl disabled:opacity-70 cursor-pointer"
                >
                  {editingData ? "ACTUALIZAR RESERVA" : "CREAR RESERVA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
