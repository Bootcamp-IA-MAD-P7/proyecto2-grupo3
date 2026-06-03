import { useCallback, useEffect, useRef, useState } from "react";
import type {
  GameMasterRequest
} from "../../models/EscapeRoom";

const WS_BASE_URL =
  import.meta.env.VITE_API_URL_WS || "ws://localhost:8000/api/ws/sala";
const TIEMPO_MENSAJE_MS = 25000;

export const useEscapeRoomWS = (salaId: string | number | null) => {
  const [isConnected, setIsConnected] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentHint, setCurrentHint] = useState<{
    text: string;
    type: string;
  } | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const connect = useCallback(() => {
    if (!salaId) return;

    setIsGameOver(false);

    ws.current = new WebSocket(`${WS_BASE_URL}/${salaId}`);

    ws.current.onopen = () => {
      console.log(`Túnel WebSocket abierto para la sala ${salaId}`);

      setIsConnected(true);

      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

      pingIntervalRef.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ action: "ping" }));
        }
      }, 30000);
    };

    ws.current.onclose = () => {
      console.warn(`Túnel de la sala ${salaId} cerrado. Reintentando...`);
      setIsConnected(false);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event_type === "time_sync") {
          setTimeLeft(data.time_left);
        } else if (data.event_type === "game_over") {
          setIsGameOver(true);
          setTimeLeft(0);
        } else if (
          data.event_type === "hint_received" ||
          data.event_type === "room_event"
        ) {
          setCurrentHint({
            text: data.text_display,
            type: data.voice_type || "normal",
          });

          if (data.audio_base64) {
            const audio = new Audio(
              `data:audio/mpeg;base64,${data.audio_base64}`,
            );
            audio
              .play()
              .catch((e) => console.error("Error reproduciendo audio:", e));
          }

          setTimeout(() => setCurrentHint(null), TIEMPO_MENSAJE_MS);
        }
      } catch (error) {
        console.error("Error parseando mensaje WS:", error);
      }
    };
  }, [salaId]);

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

  return { isConnected, timeLeft, isGameOver, currentHint, sendAction };
};
