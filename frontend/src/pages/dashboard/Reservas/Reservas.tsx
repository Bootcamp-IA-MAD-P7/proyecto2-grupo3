import { CalendarDays, Play, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "../../../components/common/DataTable/DataTable";
import DataTable from "../../../components/common/DataTable/DataTable";
import { ROUTES } from "../../../constants/routes";
import {
  useCrearReserva,
  useEliminarReserva,
  useObtenerClientes,
  useObtenerDisponibilidad,
  useObtenerReservas,
  useObtenerSalas,
} from "../../../services/ScapeRoom/useEscapeRoom";

export default function Reservas() {
  const [_currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [calDate, setCalDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSalaId, setSelectedSalaId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reservaTotal, setReservaTotal] = useState<number>(0);

  const { data: salas, isLoading: loadingSalas } = useObtenerSalas();
  const { data: clientes, isLoading: loadingClientes } = useObtenerClientes();
  const { data: reservas, isLoading: loadingReservas } = useObtenerReservas();
  
  const { mutate: crearReserva, isPending: isCreating } = useCrearReserva();
  const { mutate: eliminarReserva } = useEliminarReserva();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const obtenerHoraMadridLocal = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Madrid',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(new Date());
    const p: any = {};
    parts.forEach(({ type, value }) => (p[type] = value));
    
    const isoStr = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
    return new Date(isoStr).getTime();
  };

  const fechaStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const { data: disponibilidad } = useObtenerDisponibilidad(selectedSalaId, fechaStr);

  const reservasMapeadas = useMemo(() => {
    if (!reservas) return [];
    return reservas.map(r => ({
      ...r,
      sala_nombre: salas?.find(s => s.id_sala === r.id_sala)?.nombre || `Sala ${r.id_sala}`,
      cliente_nombre: clientes?.find(c => c.id_cliente === r.id_cliente)
          ? `${clientes.find(c => c.id_cliente === r.id_cliente)?.nombre} ${clientes.find(c => c.id_cliente === r.id_cliente)?.apellido}`
          : `Cliente ${r.id_cliente}`
    }));
  }, [reservas, salas, clientes]);

  const openModalNew = () => {
    setSelectedSalaId(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setReservaTotal(0);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCrearReserva = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!selectedSalaId || !selectedDate || !selectedSlot) return alert("Selecciona fecha y hora de los horarios disponibles.");

    crearReserva({
      id_sala: Number(formData.get("id_sala")),
      id_cliente: Number(formData.get("id_cliente")),
      id_empleado: null,
      fecha_hora: `${fechaStr}T${selectedSlot}:00`,
      numero_jugadores: Number(formData.get("numero_jugadores")),
      total_pagado: Number(formData.get("total_pagado")),
    }, {
      onSuccess: () => closeModal()
    });
  };

  const handleExportCSV = () => {
    if (!reservasMapeadas.length) return;
    const headers = ["ID", "SALA", "CLIENTE", "FECHA Y HORA", "PAGADO"];
    const csvContent = [
      headers.join(","),
      ...reservasMapeadas.map(r => `${r.id_reserva},"${r.sala_nombre}","${r.cliente_nombre}","${r.fecha_hora}",${r.total_pagado}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `reservas_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(Number(v ?? 0));

  const abrirSala = (reservaId: number) => {
    window.open(`${ROUTES.APP.GAME_MASTER_PANEL}${reservaId}`, "_blank");
    setTimeout(() => {
      window.open(`${ROUTES.APP.ESCAPE_ROOM}${reservaId}`, "_blank");
    }, 100);
  };

  const renderDays = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <div
          key={d}
          onClick={() => !isPast && setSelectedDate(date)}
          className={`aspect-square flex items-center justify-center rounded-md text-[13px] font-semibold border transition-colors 
            ${isPast ? "opacity-30 cursor-not-allowed border-transparent bg-slate-50" : "cursor-pointer hover:border-teal-700 bg-slate-50 border-transparent"} 
            ${isSelected ? "!bg-teal-700 !text-white !border-teal-800" : "text-slate-900"}
          `}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const columns: ColumnDef[] = [
    { header: "ID", accessorKey: "id_reserva", className: "font-medium text-xs" },
    { 
      header: "Sala Asignada", 
      cell: (row) => <div className="text-sm font-bold text-slate-800">{row.sala_nombre}</div> 
    },
    { 
      header: "Cliente", 
      cell: (row) => <div className="text-xs text-slate-600">{row.cliente_nombre}</div> 
    },
    { 
      header: "Fecha y Hora", 
      cell: (row) => <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded inline-block">{new Date(row.fecha_hora).toLocaleString("es-ES")}</div> 
    },
    { 
      header: "Reserva Pagada", 
      cell: (row) => <span className="text-sm font-bold text-emerald-600">{formatCurrency(row.total_pagado)}</span> 
    },
    {
      header: "Monitorización",
      className: "text-center",
      cell: (row) => {
        const inicio = new Date(row.fecha_hora).getTime();
        const fin = inicio + 60 * 60 * 1000; 
        const ahora = obtenerHoraMadridLocal();
        const estaActiva = ahora >= inicio && ahora <= fin;

        return (
          <button
            type="button"
            onClick={() => abrirSala(row.id_reserva)}
            disabled={!estaActiva}
            title={estaActiva ? "Desplegar monitores de la sala" : "Fuera del horario de reserva"}
            className={`min-h-[32px] inline-flex items-center px-3 rounded-lg text-xs font-bold transition-all duration-300 
              ${estaActiva ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_10px_-2px_rgba(37,99,235,0.6)] cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"}
            `}
          >
            <Play className={`w-3 h-3 mr-1.5 ${estaActiva ? "fill-white" : ""}`} />
            Conectar Sala
          </button>
        );
      }
    }
  ];

  return (
    <div className="w-full flex flex-col animate-fade-in">
      <DataTable
        title="Gestor de Reservas"
        subtitle="Operaciones Activas"
        ButtonNewText="NUEVA RESERVA"
        data={reservasMapeadas}
        columns={columns}
        searchFields={["sala_nombre", "cliente_nombre", "fecha_hora"]}
        idKey="id_reserva"
        isLoading={loadingReservas || loadingSalas || loadingClientes}
        handleExportCSV={handleExportCSV}
        openModalNew={openModalNew}
        onDelete={(row) => eliminarReserva(row.id_reserva)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-md">
                   <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">Nueva Reserva</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asignación de Sesión</p>
                </div>
              </div>
              <button type="button" onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            <form onSubmit={handleCrearReserva} className="flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto">
              
              <div className="w-full md:w-1/2 p-6 flex flex-col gap-5 border-r border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Sala <span className="text-red-500">*</span></label>
                  <select
                    name="id_sala" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:border-teal-500 outline-none transition-all cursor-pointer"
                    onChange={(e) => {
                      const s = salas?.find((x) => x.id_sala === Number(e.target.value));
                      setSelectedSalaId(s ? s.id_sala : null);
                      setReservaTotal(s ? s.precio * 0.5 : 0);
                      setSelectedDate(null);
                      setSelectedSlot(null);
                    }}
                  >
                    <option value="">— Selecciona una sala —</option>
                    {salas?.map((s) => (
                      <option key={s.id_sala} value={s.id_sala}>{s.nombre} - {formatCurrency(s.precio)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Cliente <span className="text-red-500">*</span></label>
                  <select name="id_cliente" required className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:border-teal-500 outline-none transition-all cursor-pointer">
                    <option value="">— Selecciona un cliente —</option>
                    {clientes?.map((c) => (
                      <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Jugadores <span className="text-red-500">*</span></label>
                  <input 
                    name="numero_jugadores" 
                    type="number" 
                    min="2" 
                    max="6" 
                    required 
                    defaultValue="4" 
                    onKeyDown={(e) => {
                      if (['-', 'e', 'E', '+', '.', ','].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:border-teal-500 outline-none transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Monto Reserva (50%) <span className="text-red-500">*</span></label>
                  {/* Este input es readOnly, el usuario no puede escribir aquí de todos modos */}
                  <input name="total_pagado" type="number" readOnly value={reservaTotal} className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-sm cursor-default" />
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 bg-slate-50/50 flex flex-col gap-4">
                {!selectedSalaId ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-xl">
                    Selecciona una sala primero para ver horarios.
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3 font-bold text-[15px] text-slate-800">
                        <button type="button" onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))} className="min-h-[32px] min-w-[32px] flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 text-xl leading-none cursor-pointer">&lsaquo;</button>
                        <span className="uppercase tracking-wider text-xs">{calDate.toLocaleString("es-ES", { month: "long", year: "numeric" })}</span>
                        <button type="button" onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))} className="min-h-[32px] min-w-[32px] flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 text-xl leading-none cursor-pointer">&rsaquo;</button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => <div key={d} className="text-center text-[10px] font-black text-slate-400 py-1 uppercase">{d}</div>)}
                        {renderDays()}
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <span className="text-slate-800 text-xs font-black tracking-widest uppercase">{selectedDate.toLocaleDateString()}</span>
                        </div>

                        {disponibilidad?.slots?.length === 0 ? (
                          <p className="text-slate-400 text-xs text-center py-4">Sin horarios disponibles.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {disponibilidad?.slots?.map((slot, idx) => {
                              const isSelected = selectedSlot === slot.hora_inicio;
                              
                              // Evaluamos si el bloque horario ya pasó en el mundo real
                              const slotTimestamp = new Date(`${fechaStr}T${slot.hora_inicio}:00`).getTime();
                              const isPastSlot = slotTimestamp < obtenerHoraMadridLocal();
                              
                              // Disponible solo si el backend dice que sí y además no ha pasado la hora
                              const isAvailable = slot.disponible && !isPastSlot;
                              
                              return (
                                <button
                                  key={idx} type="button" disabled={!isAvailable} onClick={() => setSelectedSlot(slot.hora_inicio)}
                                  className={`min-h-[38px] min-w-[70px] border rounded-lg px-2 font-bold text-xs transition-colors shadow-sm
                                    ${!isAvailable ? "bg-slate-50 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed line-through" 
                                      : isSelected ? "bg-teal-600 text-white border-teal-700 shadow-teal-600/30" 
                                      : "bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:text-teal-600 cursor-pointer"}
                                  `}
                                >
                                  {slot.hora_inicio}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div className="mt-auto pt-4 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">CANCELAR</button>
                  <button type="submit" disabled={!selectedSlot || isCreating} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-teal-600/20 cursor-pointer">
                    <Save className="w-4 h-4" /> {isCreating ? 'CREANDO...' : 'CONFIRMAR RESERVA'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}