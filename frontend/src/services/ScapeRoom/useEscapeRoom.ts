import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CrearClienteRequest, CrearEmpleadoRequest, CrearReservaRequest, CrearSalaRequest,
  GameMasterRequest, RoomEventResponse
} from "../../models/EscapeRoom";
import { EscapeRoomApi } from "./ScapeRoomApi";

const escapeRoomApi = new EscapeRoomApi();

export const ESCAPE_ROOM_KEYS = {
  all: ["escapeRoom"] as const,
  salas: () => [...ESCAPE_ROOM_KEYS.all, "salas"] as const,
  clientes: () => [...ESCAPE_ROOM_KEYS.all, "clientes"] as const,
  empleados: () => [...ESCAPE_ROOM_KEYS.all, "empleados"] as const,
  reservas: () => [...ESCAPE_ROOM_KEYS.all, "reservas"] as const,
  disponibilidad: (salaId: number, fecha: string) => [...ESCAPE_ROOM_KEYS.all, "disponibilidad", salaId, fecha] as const,
};

// --- SALAS ---
export const useObtenerSalas = () => useQuery({ queryKey: ESCAPE_ROOM_KEYS.salas(), queryFn: () => escapeRoomApi.obtenerSalas() });
export const useCrearSala = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CrearSalaRequest) => escapeRoomApi.crearSala(data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.salas() }) });
};
export const useActualizarSala = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: CrearSalaRequest }) => escapeRoomApi.actualizarSala(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.salas() }) });
};
export const useEliminarSala = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => escapeRoomApi.eliminarSala(id), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.salas() }) });
};

// --- CLIENTES ---
export const useObtenerClientes = () => useQuery({ queryKey: ESCAPE_ROOM_KEYS.clientes(), queryFn: () => escapeRoomApi.obtenerClientes() });
export const useCrearCliente = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CrearClienteRequest) => escapeRoomApi.crearCliente(data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.clientes() }) });
};
export const useActualizarCliente = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: CrearClienteRequest }) => escapeRoomApi.actualizarCliente(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.clientes() }) });
};
export const useEliminarCliente = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => escapeRoomApi.eliminarCliente(id), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.clientes() }) });
};

// --- EMPLEADOS ---
export const useObtenerEmpleados = () => useQuery({ queryKey: ESCAPE_ROOM_KEYS.empleados(), queryFn: () => escapeRoomApi.obtenerEmpleados() });
export const useCrearEmpleado = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CrearEmpleadoRequest) => escapeRoomApi.crearEmpleado(data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.empleados() }) });
};
export const useActualizarEmpleado = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: CrearEmpleadoRequest }) => escapeRoomApi.actualizarEmpleado(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.empleados() }) });
};
export const useEliminarEmpleado = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => escapeRoomApi.eliminarEmpleado(id), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.empleados() }) });
};

// --- RESERVAS ---
export const useObtenerReservas = () => useQuery({ queryKey: ESCAPE_ROOM_KEYS.reservas(), queryFn: () => escapeRoomApi.obtenerReservas() });
export const useCrearReserva = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CrearReservaRequest) => escapeRoomApi.crearReserva(data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.reservas() }) });
};
export const useActualizarReserva = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: CrearReservaRequest }) => escapeRoomApi.actualizarReserva(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.reservas() }) });
};
export const useEliminarReserva = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => escapeRoomApi.eliminarReserva(id), onSuccess: () => qc.invalidateQueries({ queryKey: ESCAPE_ROOM_KEYS.reservas() }) });
};

// --- DISPONIBILIDAD ---
export const useObtenerDisponibilidad = (salaId: number | null, fecha: string | null) => {
  return useQuery({
    queryKey: ESCAPE_ROOM_KEYS.disponibilidad(salaId!, fecha!),
    queryFn: () => escapeRoomApi.obtenerDisponibilidad(salaId!, fecha!),
    enabled: !!salaId && !!fecha, // Solo se ejecuta si hay sala y fecha seleccionada
  });
};

const WS_URL = import.meta.env.VITE_API_URL_WS || "";
const TIEMPO_MENSAJE_MS = 25000;

export const useEscapeRoom = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentHint, setCurrentHint] = useState<{
    text: string;
    type: string;
  } | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const connect = useCallback(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("Túnel WebSocket abierto y estabilizado");
      setIsConnected(true);

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }

      pingIntervalRef.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ action: "ping" }));
        }
      }, 30000);
    };

    ws.current.onclose = () => {
      console.warn("Túnel cerrado o inalcanzable. Reintentando en 3 segundos...");
      setIsConnected(false);
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }

      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.current.onmessage = (event) => {
      try {
        const data: RoomEventResponse = JSON.parse(event.data);

        if (data.event_type === "hint_received") {
          setCurrentHint({
            text: data.text_display,
            type: data.voice_type || "normal",
          });

          if (data.audio_base64) {
            const audio = new Audio(`data:audio/mpeg;base64,${data.audio_base64}`);
            audio.play().catch((e) => console.error("Error reproduciendo audio:", e));
          }

          setTimeout(() => setCurrentHint(null), TIEMPO_MENSAJE_MS);
        }
      } catch (error) {}
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    };
  }, [connect]);

  const sendAction = (payload: GameMasterRequest) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    } else {
      console.error("No se pudo enviar, WebSocket desconectado");
    }
  };

  return { isConnected, currentHint, sendAction };
};
