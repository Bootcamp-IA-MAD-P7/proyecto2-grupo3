import { useEffect, useState } from 'react';
import { ROUTES } from '../../constants/routes';
import {
  useCrearCliente,
  useCrearEmpleado,
  useCrearReserva,
  useCrearSala,
  useEliminarCliente,
  useEliminarEmpleado,
  useEliminarReserva,
  useEliminarSala,
  useObtenerClientes,
  useObtenerDisponibilidad,
  useObtenerEmpleados,
  useObtenerReservas,
  useObtenerSalas
} from '../../services/ScapeRoom/useEscapeRoom';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('reservas');
  
  const [calDate, setCalDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSalaId, setSelectedSalaId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reservaTotal, setReservaTotal] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: salas } = useObtenerSalas();
  const { data: clientes } = useObtenerClientes();
  const { data: empleados } = useObtenerEmpleados();
  const { data: reservas } = useObtenerReservas();
  
  const fechaStr = selectedDate ? 
    `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` 
    : null;
  
  const { data: disponibilidad } = useObtenerDisponibilidad(selectedSalaId, fechaStr);

  // Mutations
  const { mutate: crearSala } = useCrearSala();
  const { mutate: eliminarSala } = useEliminarSala();
  const { mutate: crearCliente } = useCrearCliente();
  const { mutate: eliminarCliente } = useEliminarCliente();
  const { mutate: crearEmpleado } = useCrearEmpleado();
  const { mutate: eliminarEmpleado } = useEliminarEmpleado();
  const { mutate: crearReserva } = useCrearReserva();
  const { mutate: eliminarReserva } = useEliminarReserva();

  // --- HANDLERS SUBMIT ---
  const handleCrearSala = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    crearSala({
      nombre: String(data.nombre), tematica: String(data.tematica),
      dificultad: String(data.dificultad), capacidad_max: Number(data.capacidad_max), precio: Number(data.precio)
    });
    e.currentTarget.reset();
  };

  const handleCrearCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    crearCliente({
      nombre: String(data.nombre), apellido: String(data.apellido),
      email: String(data.email), telefono: String(data.telefono)
    });
    e.currentTarget.reset();
  };

  const handleCrearEmpleado = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    crearEmpleado({
      nombre: String(data.nombre), apellido: String(data.apellido), rol: String(data.rol)
    });
    e.currentTarget.reset();
  };

  const handleCrearReserva = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!selectedSalaId || !selectedDate || !selectedSlot) return alert("Selecciona fecha y hora");
    
    crearReserva({
      id_sala: Number(data.id_sala), id_cliente: Number(data.id_cliente), id_empleado: null,
      fecha_hora: `${fechaStr}T${selectedSlot}:00`,
      numero_jugadores: Number(data.numero_jugadores), total_pagado: Number(data.total_pagado)
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      }
    });
    e.currentTarget.reset();
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  // --- CALENDARIO BÁSICO ---
  const renderDays = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date(new Date().setHours(0,0,0,0));
      
      days.push(
        <div 
          key={d} 
          onClick={() => !isPast && setSelectedDate(date)}
          className={`aspect-square flex items-center justify-center rounded-md text-[13px] font-semibold border transition-colors 
            ${isPast ? 'opacity-30 cursor-not-allowed border-transparent bg-slate-50' : 'cursor-pointer hover:border-teal-700 bg-slate-50 border-transparent'} 
            ${isSelected ? '!bg-teal-700 !text-white !border-teal-800' : 'text-slate-900'}
          `}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(Number(v ?? 0));

  const abrirSala = (salaId: number) => {
    window.open(`${ROUTES.APP.GAME_MASTER_PANEL}${salaId}`, "_blank");
    
    setTimeout(() => {
      window.open(`${ROUTES.APP.ESCAPE_ROOM}${salaId}`, "_blank");
    }, 100);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row-reverse w-full mx-auto p-5 md:p-6 gap-5 min-h-[calc(100vh-73px)] bg-slate-50 text-slate-900 font-sans">
      
      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">

        {/* ========== SECCIÓN SALAS ========== */}
        <section className={activeSection === 'salas' ? 'block' : 'hidden'}>
          <h2 className="text-xl m-0 mb-4 font-bold">Gestión de Salas</h2>

          <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-base font-bold m-0">Crear sala</h3>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4" onSubmit={handleCrearSala}>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Nombre 
                <input name="nombre" required maxLength={100} placeholder="La cripta" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Temática 
                <input name="tematica" required maxLength={100} placeholder="Misterio" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Dificultad
                <select name="dificultad" defaultValue="Medio" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal">
                  <option value="Fácil">Fácil</option><option value="Medio">Medio</option><option value="Difícil">Difícil</option><option value="Experto">Experto</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Capacidad máxima 
                <input name="capacidad_max" type="number" min="1" required defaultValue="6" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" />
              </label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Precio (€) 
                <input name="precio" type="number" min="0" step="0.01" required defaultValue="50" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" />
              </label>
              <button type="submit" className="self-end min-h-[38px] rounded-md px-3.5 bg-teal-700 text-white font-bold text-sm hover:bg-teal-800">Crear sala</button>
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
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Nombre</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Temática</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Dificultad</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Capacidad</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Precio</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase"></th>
                  </tr>
                </thead>
                <tbody>
                  {salas?.length === 0 && <tr><td colSpan={7} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin salas registradas</td></tr>}
                  {salas?.map(s => (
                    <tr key={s.id_sala}>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{s.id_sala}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{s.nombre}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{s.tematica}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{s.dificultad}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{s.capacidad_max}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{formatCurrency(s.precio)}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                        <button type="button" onClick={() => eliminarSala(s.id_sala)} className="min-h-[30px] min-w-[60px] text-xs px-2.5 rounded bg-red-700 text-white font-bold hover:bg-red-800">Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========== SECCIÓN CLIENTES ========== */}
        <section className={activeSection === 'clientes' ? 'block' : 'hidden'}>
          <h2 className="text-xl m-0 mb-4 font-bold">Gestión de Clientes</h2>

          <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-base font-bold m-0">Crear cliente</h3>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4" onSubmit={handleCrearCliente}>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Nombre <input name="nombre" required maxLength={20} placeholder="Ana" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" /></label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Apellido <input name="apellido" required maxLength={20} placeholder="López" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" /></label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Email <input name="email" type="email" required maxLength={50} placeholder="ana@test.io" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" /></label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Teléfono <input name="telefono" maxLength={20} placeholder="600000000" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" /></label>
              <button type="submit" className="self-end min-h-[38px] rounded-md px-3.5 bg-teal-700 text-white font-bold text-sm hover:bg-teal-800">Crear cliente</button>
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
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Nombre</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Email</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Teléfono</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase"></th>
                  </tr>
                </thead>
                <tbody>
                  {clientes?.length === 0 && <tr><td colSpan={5} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin clientes registrados</td></tr>}
                  {clientes?.map(c => (
                    <tr key={c.id_cliente}>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{c.id_cliente}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{c.nombre} {c.apellido}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{c.email}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{c.telefono || '—'}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                        <button type="button" onClick={() => eliminarCliente(c.id_cliente)} className="min-h-[30px] min-w-[60px] text-xs px-2.5 rounded bg-red-700 text-white font-bold hover:bg-red-800">Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========== SECCIÓN EMPLEADOS ========== */}
        <section className={activeSection === 'empleados' ? 'block' : 'hidden'}>
          <h2 className="text-xl m-0 mb-4 font-bold">Gestión de Empleados</h2>

          <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-base font-bold m-0">Crear empleado</h3>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4" onSubmit={handleCrearEmpleado}>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Nombre <input name="nombre" required maxLength={20} placeholder="Carlos" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" /></label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Apellido <input name="apellido" required maxLength={20} placeholder="Martín" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" /></label>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Rol
                <select name="rol" defaultValue="Game Master" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal">
                  <option value="Game Master">Game Master</option><option value="Recepcionista">Recepcionista</option><option value="Gerente">Gerente</option><option value="Mantenimiento">Mantenimiento</option>
                </select>
              </label>
              <button type="submit" className="self-end min-h-[38px] rounded-md px-3.5 bg-teal-700 text-white font-bold text-sm hover:bg-teal-800">Crear empleado</button>
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
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Nombre</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Rol</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase"></th>
                  </tr>
                </thead>
                <tbody>
                  {empleados?.length === 0 && <tr><td colSpan={4} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin empleados registrados</td></tr>}
                  {empleados?.map(e => (
                    <tr key={e.id_empleado}>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{e.id_empleado}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{e.nombre} {e.apellido}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{e.rol}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                        <button type="button" onClick={() => eliminarEmpleado(e.id_empleado)} className="min-h-[30px] min-w-[60px] text-xs px-2.5 rounded bg-red-700 text-white font-bold hover:bg-red-800">Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========== SECCIÓN RESERVAS ========== */}
        <section className={activeSection === 'reservas' ? 'block' : 'hidden'}>
          <h2 className="text-xl m-0 mb-4 font-bold">Gestión de Reservas</h2>

          <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-base font-bold m-0">Nueva reserva</h3>
            </div>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4" onSubmit={handleCrearReserva}>
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Sala
                <select name="id_sala" required className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" onChange={(e) => {
                  const s = salas?.find(x => x.id_sala === Number(e.target.value));
                  setSelectedSalaId(s ? s.id_sala : null);
                  setReservaTotal(s ? s.precio * 0.5 : 0);
                  setSelectedDate(null);
                  setSelectedSlot(null);
                }}>
                  <option value="">— Selecciona una sala —</option>
                  {salas?.map(s => <option key={s.id_sala} value={s.id_sala}>{s.nombre} - {formatCurrency(s.precio)}</option>)}
                </select>
              </label>
              
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Cliente
                <select name="id_cliente" required className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal">
                  <option value="">— Selecciona un cliente —</option>
                  {clientes?.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>)}
                </select>
              </label>
              
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Jugadores
                <input name="numero_jugadores" type="number" min="2" max="6" required defaultValue="4" className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal" />
              </label>
              
              <label className="flex flex-col gap-1 text-slate-500 text-xs font-bold">Monto reserva (50% del precio)
                <input name="total_pagado" type="number" readOnly value={reservaTotal} className="w-full min-h-[36px] border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-sm font-normal bg-slate-100 cursor-default" />
              </label>

              {/* Calendario */}
              {selectedSalaId && (
                <div className="col-span-1 md:col-span-2 px-4 pb-3 border-b border-slate-200 mt-2">
                  <div className="flex items-center justify-between mb-2 font-bold text-[15px]">
                    <button type="button" onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))} className="min-h-[32px] min-w-[32px] flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 text-xl leading-none">&lsaquo;</button>
                    <span>{calDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
                    <button type="button" onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))} className="min-h-[32px] min-w-[32px] flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 text-xl leading-none">&rsaquo;</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['Do','Lu','Ma','Mi','Ju','Vi','Sa'].map(d => <div key={d} className="text-center text-[11px] font-bold text-slate-500 py-1">{d}</div>)}
                    {renderDays()}
                  </div>
                </div>
              )}

              {/* Slots */}
              {selectedDate && (
                <div className="col-span-1 md:col-span-2 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-[13px] font-bold">{selectedDate.toLocaleDateString()}</span>
                    <div className="flex gap-3 text-[12px] text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-100 border border-green-800"></span> Libre</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-700"></span> Ocupado</span>
                    </div>
                  </div>
                  
                  {disponibilidad?.slots?.length === 0 ? (
                    <p className="text-slate-500 text-[13px] italic m-0">Sin horarios disponibles para esta fecha.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {disponibilidad?.slots?.map((slot, idx) => {
                        const isSelected = selectedSlot === slot.hora_inicio;
                        const isAvailable = slot.disponible;
                        
                        return (
                          <button 
                            key={idx} type="button" disabled={!isAvailable} onClick={() => setSelectedSlot(slot.hora_inicio)}
                            className={`min-h-[38px] min-w-[80px] border rounded-md px-3 font-bold text-[13px] transition-colors
                              ${!isAvailable ? 'bg-red-100 text-red-700 border-red-200 opacity-60 cursor-not-allowed' : 
                                isSelected ? 'bg-teal-700 text-white border-teal-800' : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-800'}
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

              {showSuccess && (
                <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-2.5 mx-4 mb-3 p-3.5 rounded-lg bg-green-100 text-green-800 font-bold border border-green-800">
                  <span className="font-black text-[22px]">✓</span> Reserva realizada con éxito
                </div>
              )}

              <div className="col-span-1 md:col-span-2 flex justify-center p-4">
                <button type="submit" disabled={!selectedSlot} className="min-h-[46px] min-w-[220px] text-base rounded-lg bg-teal-700 text-white font-bold hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed">Crear reserva</button>
              </div>
            </form>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-lg bg-white mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-base font-bold m-0">Reservas registradas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Sala</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Cliente</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Fecha y hora</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Pagado</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap text-slate-500 text-xs uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas?.length === 0 && <tr><td colSpan={6} className="border-b border-slate-200 px-3 py-2.5 text-slate-500">Sin reservas registradas</td></tr>}
                  {reservas?.map(r => {
                    const inicio = new Date(r.fecha_hora).getTime();
                    const fin = inicio + (60 * 60 * 1000); // +1 hora
                    const ahora = currentTime.getTime();
                    const estaActiva = /*ahora >= inicio && ahora <= fin*/ true;

                    return (
                      <tr key={r.id_reserva}>
                        <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{r.id_reserva}</td>
                        <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{salas?.find(s => s.id_sala === r.id_sala)?.nombre || r.id_sala}</td>
                        <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{clientes?.find(c => c.id_cliente === r.id_cliente)?.nombre || r.id_cliente}</td>
                        <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{new Date(r.fecha_hora).toLocaleString("es-ES")}</td>
                        <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">{formatCurrency(r.total_pagado)}</td>
                        <td className="border-b border-slate-200 px-3 py-2.5 text-left whitespace-nowrap">
                          <div className="flex gap-2 items-center">
                            <button 
                              type="button" 
                              onClick={() => eliminarReserva(r.id_reserva)} 
                              className="min-h-[30px] min-w-[60px] text-xs px-2.5 rounded bg-red-700 text-white font-bold hover:bg-red-800"
                            >
                              Anular
                            </button>
                            <button 
                              type="button" 
                              onClick={() => abrirSala(r.id_sala)}
                              disabled={!estaActiva}
                              title={estaActiva ? "Desplegar monitores de la sala" : "Fuera del horario de reserva"}
                              className={`min-h-[30px] flex items-center px-2.5 rounded text-xs font-bold transition-all duration-200 
                                ${estaActiva ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_0_10px_-2px_rgba(37,99,235,0.5)]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                              `}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                              Abrir Sala
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      {/* SIDEBAR */}
      <nav className="w-full md:w-[200px] shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto">
        {['reservas', 'salas', 'clientes', 'empleados'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`w-full min-h-[44px] border rounded-lg px-4 font-bold text-sm text-center md:text-left transition-colors capitalize
              ${activeSection === tab ? 'bg-teal-700 text-white border-teal-800' : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100'}
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}