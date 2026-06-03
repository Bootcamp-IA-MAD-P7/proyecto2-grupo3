// models/EscapeRoom.ts

export interface GameMasterRequest {
  action: 'send_hint' | 'pause_timer';
  text?: string;
  voice_type?: string;
}

export interface RoomEventResponse {
  event_type: 'hint_received' | 'timer_paused';
  text_display: string;
  audio_base64?: string;
  voice_type?: string;
}

// --- SALAS ---
export interface Sala {
  id_sala: number;
  nombre: string;
  tematica: string;
  dificultad: string;
  capacidad_max: number;
  precio: number;
}
export type CrearSalaRequest = Omit<Sala, "id_sala">;

// --- CLIENTES ---
export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
}
export type CrearClienteRequest = Omit<Cliente, "id_cliente">;

// --- EMPLEADOS ---
export interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  rol: string;
}
export type CrearEmpleadoRequest = Omit<Empleado, "id_empleado">;

// --- RESERVAS ---
export interface Reserva {
  id_reserva: number;
  id_sala: number;
  id_cliente: number;
  id_empleado: number | null;
  fecha_hora: string;
  numero_jugadores: number;
  total_pagado: number;
  estado?: string;
}
export type CrearReservaRequest = Omit<Reserva, "id_reserva" | "estado">;

// --- DISPONIBILIDAD ---
export interface SlotDisponibilidad {
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
}
export interface DisponibilidadResponse {
  slots: SlotDisponibilidad[];
}

// --- PAGINACION ---
export interface Paginacion {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  paginacion: Paginacion;
}

export interface ClienteConReservas extends Cliente {
  reservas: Reserva[];
}