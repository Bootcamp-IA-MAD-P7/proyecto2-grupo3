import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useObtenerReservas,
  useObtenerSalas,
} from "../../services/ScapeRoom/useEscapeRoom";
import { toArray } from "../../utils/toArray";
import { useEscapeRoomWS } from "../../services/ScapeRoom/useEscapeRoomWS";
import { parseFechaLocal, nowMadrid } from "../../utils/parseFechaLocal";
import PantallaTerminal from "../system/PantallaTerminal/PantallaTerminal";

const EscapeRoom = () => {
  const { reservaId } = useParams();

  const { data: salas, isLoading: loadingSalas } = useObtenerSalas();
  const { data: reservas, isLoading: loadingReservas } = useObtenerReservas();

  const reservaActiva = reservas?.find(
    (r) => r.id_reserva === Number(reservaId),
  );
  const salaId = reservaActiva?.id_sala;
  const salaActual = salas?.find((s) => s.id_sala === salaId);

  const { currentHint, timeLeft, isGameOver } = useEscapeRoomWS(
    salaId ? String(salaId) : null,
  );

  const [_currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const obtenerHoraMadridLocal = () => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const p: any = {};
    parts.forEach(({ type, value }) => (p[type] = value));
    const isoStr = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
    return new Date(isoStr).getTime();
  };

  const isLoading = salasQuery.isLoading || reservasQuery.isLoading;
  let estadoSistema = "ACTIVO";
  let errorMsg = { cod: "", msg: "" };
  let segundosCalculados = 0;

  if (!isLoading) {
    if (!reservaActiva) {
      estadoSistema = "ERROR";
      errorMsg = {
        cod: "ERR_NO_LINK",
        msg: "ENLACE NO ENCONTRADO EN LA RED PRINCIPAL",
      };
    } else if (!salaActual) {
      estadoSistema = "ERROR";
      errorMsg = {
        cod: "ERR_CORRUPT",
        msg: "HARDWARE DE SALA NO ASIGNADO O CORRUPTO",
      };
    } else {
      const inicio = new Date(reservaActiva.fecha_hora).getTime();
      const fin = inicio + 60 * 60 * 1000;
      const ahora = obtenerHoraMadridLocal();

      if (ahora < inicio) {
        estadoSistema = "STANDBY";
        errorMsg = {
          cod: "SYS.STANDBY",
          msg: "ESPERANDO INICIO DE SECUENCIA...",
        };
      } else if (ahora >= inicio + 60 * 60 * 1000 && !isGameOver) {
        estadoSistema = "ERROR";
        errorMsg = {
          cod: "SYS.TERMINATED",
          msg: "LA SESIÓN HA SIDO DESTRUIDA",
        };
      } else {
        segundosCalculados = Math.max(0, Math.floor((fin - ahora) / 1000));
      }
    }
  }

  const tiempoAMostrar = timeLeft !== null ? timeLeft : segundosCalculados;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLowTime = tiempoAMostrar <= 300; 

  const getEffectClass = (type: string) => {
    if (type === "hackeado")
      return "text-fuchsia-500 animate-pulse shadow-[0_0_20px_rgba(217,70,239,0.5)] skew-x-[-10deg]";
    if (type === "tenebroso")
      return "text-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-bounce";
    return "text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]";
  };

  if (isLoading)
    return (
      <PantallaTerminal
        codigo="BOOTING..."
        mensaje="INICIANDO PROTOCOLOS DE COMUNICACIÓN"
      />
    );
  if (estadoSistema !== "ACTIVO")
    return <PantallaTerminal codigo={errorMsg.cod} mensaje={errorMsg.msg} />;

  return (
    <div
      className={`w-full min-h-screen bg-[#020202] flex flex-col items-center justify-center overflow-hidden relative transition-colors duration-1000 ${isGameOver ? "bg-[#1a0505]" : ""}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50 opacity-60"></div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.95)] z-40"></div>

      <div className="absolute top-8 left-8 right-8 flex justify-between z-30 opacity-40 font-mono text-xs tracking-[0.3em] uppercase">
        <span className="text-cyan-500">LINK: {salaActual?.nombre}</span>
        <span
          className={isLowTime ? "text-red-500 animate-pulse" : "text-cyan-500"}
        >
          ESTADO: {isGameOver ? "CRÍTICO" : "ESTABLE"}
        </span>
      </div>

      <div className="relative z-30 flex flex-col items-center justify-center w-full px-10">
        <div
          className={`font-mono font-black transition-all duration-700 ease-in-out flex flex-col items-center
          ${currentHint ? "text-4xl opacity-50 mb-12 scale-75" : "text-[15vw] leading-none mb-0 scale-100"} 
          ${isGameOver ? "text-red-700 blur-[1px]" : isLowTime ? "text-red-500 animate-pulse" : "text-slate-200"}
        `}
        >
          {formatTime(tiempoAMostrar)}

          {!currentHint && (
            <div
              className={`text-xl tracking-[0.5em] mt-4 uppercase ${isGameOver ? "text-red-600" : "text-slate-600"}`}
            >
              {isGameOver ? "SYSTEM FAILURE" : "TIEMPO RESTANTE"}
            </div>
          )}
        </div>

        {currentHint && (
          <div className="relative w-full max-w-6xl animate-fade-in-up">
            <div className="absolute -top-8 left-0 text-red-500/80 font-mono text-xs tracking-widest animate-pulse">
              [ WARNING: INCOMING OVERRIDE ]
            </div>

            <h1
              className={`font-mono text-5xl md:text-7xl font-black text-center tracking-[0.1em] uppercase leading-tight ${getEffectClass(currentHint.type)}`}
            >
              {currentHint.text}
            </h1>

            <div className="absolute -bottom-10 right-0 text-cyan-500/50 font-mono text-xs tracking-[0.2em]">
              TRX_ID:{" "}
              {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between z-30 opacity-30 font-mono text-[10px] tracking-widest text-slate-500">
        <span>V 2.4.1 // FACTORÍA</span>
        <span className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 h-3 ${Math.random() > 0.5 ? "bg-cyan-500" : "bg-slate-700"}`}
            ></div>
          ))}
        </span>
      </div>
    </div>
  );
};

export default EscapeRoom;
