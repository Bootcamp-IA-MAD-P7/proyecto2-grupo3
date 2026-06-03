import {
  Activity,
  Clock,
  RadioTower,
  ShieldAlert,
  Square,
  Users
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { api } from "../../api/axiosClient";
import {
  useObtenerClientes,
  useObtenerReservas,
  useObtenerSalas,
} from "../../services/ScapeRoom/useEscapeRoom";
import { toArray } from "../../utils/toArray";
import { useEscapeRoomWS } from "../../services/ScapeRoom/useEscapeRoomWS";
import { parseFechaLocal, nowMadrid, extractTime } from "../../utils/parseFechaLocal";
import PantallaBloqueo from "../system/PantallaBloqueo/PantallaBloqueo";

export default function GameMasterPanel() {
  const { reservaId } = useParams();
  const navigate = useNavigate();

  const salasQuery = useObtenerSalas();
  const reservasQuery = useObtenerReservas();
  const clientesQuery = useObtenerClientes();
  const salas = toArray(salasQuery.data);
  const reservas = toArray(reservasQuery.data);
  const clientes = toArray(clientesQuery.data);

  const reservaActiva = reservas.find((r) => r.id_reserva === Number(reservaId));
  const salaId = reservaActiva?.id_sala;
  const salaActual = salas.find((s) => s.id_sala === salaId);
  const cliente = clientes.find((c) => c.id_cliente === reservaActiva?.id_cliente);

  const { isConnected, sendAction, timeLeft, isGameOver } = useEscapeRoomWS(
    salaId ? String(salaId) : null,
  );

  const [hintText, setHintText] = useState("");
  const [voiceType, setVoiceType] = useState("normal");
  const [currentTime, setCurrentTime] = useState(() => nowMadrid());
  const startRequestSent = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(nowMadrid()), 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-start timer once when connected (fires only once via ref guard)
  useEffect(() => {
    if (!isConnected || !salaId || isGameOver) return;
    if (startRequestSent.current) return;
    startRequestSent.current = true;
    api.post(`/juego/iniciar/${salaId}`).catch((err) =>
      console.error("Error auto-iniciando juego:", err)
    );
  }, [isConnected, salaId, isGameOver]);

  const isLoading = salasQuery.isLoading || reservasQuery.isLoading;

  let accesoPermitido = false;
  let motivoBloqueo = { titulo: "", mensaje: "" };
  let segundosCalculados = 0;

  if (!isLoading) {
    if (!reservaActiva) {
      motivoBloqueo = {
        titulo: "Reserva Inexistente",
        mensaje: `No se encontró ninguna reserva con el identificador [${reservaId}].`,
      };
    } else if (!salaActual) {
      motivoBloqueo = {
        titulo: "Error de Asignación",
        mensaje: "La reserva existe, pero la sala física asignada ya no está disponible en el sistema.",
      };
    } else {
      const inicio = parseFechaLocal(reservaActiva.fecha_hora).getTime();
      const ahora = currentTime.getTime();

      if (ahora < inicio) {
        motivoBloqueo = {
          titulo: "Acceso Prematuro",
          mensaje: `La reserva está programada para las ${extractTime(reservaActiva.fecha_hora)}. Aún no es la hora.`,
        };
      } else if (ahora >= inicio + 60 * 60 * 1000) {
        motivoBloqueo = {
          titulo: "Reserva Expirada",
          mensaje: "El tiempo asignado para esta reserva ya ha finalizado.",
        };
      } else {
        accesoPermitido = true;
        const fin = inicio + 60 * 60 * 1000;
        segundosCalculados = Math.max(0, Math.floor((fin - ahora) / 1000));
      }
    }
  }

  const tiempoAMostrar = timeLeft !== null ? timeLeft : segundosCalculados;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendHint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hintText.trim()) return;

    sendAction({ action: "send_hint", text: hintText, voice_type: voiceType });
    setHintText("");
  };

  const handleStopGame = async () => {
    if (!salaId) return;
    try {
      await api.post(`/juego/parar/${salaId}`);
    } catch (err) {
      console.error("Error al detener el juego:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full bg-[#050B14] flex items-center justify-center min-h-full">
        <div className="animate-pulse text-cyan-500 font-mono tracking-widest">
          Sincronizando sistemas...
        </div>
      </div>
    );
  }

  if (!accesoPermitido) {
    return (
      <PantallaBloqueo
        titulo={motivoBloqueo.titulo}
        mensaje={motivoBloqueo.mensaje}
        onVolver={() => navigate(ROUTES.APP.MAIN)}
      />
    );
  }

  return (
    <div className="flex-1 w-full bg-[#050B14] p-4 md:p-8 flex flex-col font-sans text-slate-200 min-h-full">
      <div className="w-full mb-6 flex flex-col md:flex-row justify-between items-center bg-[#0B1120] px-6 py-4 rounded-xl border border-slate-800 shadow-lg gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-lg ${isGameOver ? "bg-red-900/50 text-red-500" : "bg-cyan-900/50 text-cyan-400"}`}
          >
            <RadioTower className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-none uppercase tracking-wider">
              {salaActual?.nombre}
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
              Temática:{" "}
              <span className="text-cyan-400 font-bold">
                {salaActual?.tematica}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/50 px-4 py-2.5 rounded-lg border border-slate-700">
            <Clock
              className={`w-5 h-5 ${tiempoAMostrar <= 300 ? "text-red-500 animate-pulse" : "text-slate-400"}`}
            />
            <span
              className={`text-2xl font-mono font-bold tracking-wider ${tiempoAMostrar <= 300 ? "text-red-500" : "text-white"}`}
            >
              {isGameOver ? "00:00" : formatTime(tiempoAMostrar)}
            </span>
          </div>

          {(timeLeft !== null && timeLeft > 0) && (
            <button
              onClick={handleStopGame}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-400 border border-red-800 font-black text-xs tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer"
              title="Detener juego (emergencia)"
            >
              <Square className="w-3.5 h-3.5" />
              Detener
            </button>
          )}

          <div className="flex items-center gap-2 bg-black/50 px-4 py-2.5 rounded-lg border border-slate-700">
            <div
              className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-red-500"}`}
            ></div>
            <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">
              {isConnected ? "En Línea" : "Desconectado"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="bg-[#0B1120] rounded-xl border border-slate-800 p-5 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Datos de Misión
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Cliente Responsable
                </p>
                <p className="text-sm font-bold text-white">
                  {cliente
                    ? `${cliente.nombre} ${cliente.apellido}`
                    : "Desconocido"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Dificultad
                </p>
                <p className="text-sm font-bold text-amber-400">
                  {salaActual?.dificultad}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Capacidad de Sala
                </p>
                <p className="text-sm font-bold text-white">
                  {reservaActiva?.numero_jugadores || 0} /{" "}
                  {salaActual?.capacidad_max} Jugadores
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1120] rounded-xl border border-slate-800 p-5 shadow-lg flex-1">
            <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4" /> Expedientes de Jugadores
            </h3>
            <div className="flex flex-col gap-3">
              {Array.from({ length: reservaActiva?.numero_jugadores || 4 }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-[#050B14] p-3 rounded-lg border border-slate-800 hover:border-cyan-900 transition-colors"
                  >
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs">
                      0{i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">
                        {i === 0
                          ? "Alex (Líder)"
                          : i === 1
                            ? "María"
                            : `Sujeto ${i + 1}`}
                      </p>
                      <p className="text-[10px] text-cyan-600 font-mono flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Constantes vitales OK
                      </p>
                    </div>
                  </div>
                ),
              )}
              <p className="text-[10px] text-slate-600 italic mt-2 text-center">
                *Los nombres reales se vincularán al actualizar la API.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="bg-[#0B1120] rounded-xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>

            <h3 className="text-sm font-bold text-cyan-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              Consola de Transmisión IA
            </h3>

            <form
              onSubmit={handleSendHint}
              className="flex flex-col gap-6 flex-1"
            >
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Mensaje Cifrado para la sala:
                </label>
                <textarea
                  value={hintText}
                  onChange={(e) => setHintText(e.target.value)}
                  placeholder="Ej: Te estoy viendo respirar, Alex..."
                  className="w-full flex-1 min-h-[150px] bg-[#050B14] border border-slate-700 rounded-lg p-4 text-cyan-400 font-mono text-base md:text-lg placeholder:text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none shadow-inner"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Modulación de Frecuencia:
                  </label>
                  <select
                    value={voiceType}
                    onChange={(e) => setVoiceType(e.target.value)}
                    className="w-full bg-[#050B14] border border-slate-700 rounded-lg p-4 text-white text-sm font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="normal">🟢 Estándar (Game Master)</option>
                    <option value="tenebroso">🔴 Entidad Tenebrosa</option>
                    <option value="hackeado">
                      🟣 Sistema Interceptado (Glitch)
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!isConnected || !hintText.trim() || isGameOver}
                  className={`w-full md:w-1/2 p-4 rounded-lg font-black text-sm md:text-base tracking-[0.1em] uppercase transition-all duration-300 ${
                    isConnected && hintText.trim() && !isGameOver
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {isGameOver ? "Juego Finalizado" : "Transmitir Audio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
