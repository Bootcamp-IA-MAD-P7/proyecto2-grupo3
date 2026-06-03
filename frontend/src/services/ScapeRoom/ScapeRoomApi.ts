import { api } from "../../api/axiosClient";
import type {
  Cliente, CrearClienteRequest,
  CrearEmpleadoRequest,
  CrearReservaRequest,
  CrearSalaRequest,
  DisponibilidadResponse,
  Empleado,
  Reserva,
  Sala
} from "../../models/EscapeRoom";
import type { EscapeRoomRepository } from "./ScapeRoomRepository";

export class EscapeRoomApi implements EscapeRoomRepository {
  // --- SALAS ---
  async obtenerSalas() { return (await api.get<Sala[]>("/salas/")).data; }
  async crearSala(data: CrearSalaRequest) { return (await api.post<Sala>("/salas/", data)).data; }
  async actualizarSala(id: number, data: CrearSalaRequest) { return (await api.put<Sala>(`/salas/${id}`, data)).data; }
  async eliminarSala(id: number) { await api.delete(`/salas/${id}`); }

  // --- CLIENTES ---
  async obtenerClientes() { return (await api.get<Cliente[]>("/clientes/")).data; }
  async crearCliente(data: CrearClienteRequest) { return (await api.post<Cliente>("/clientes/", data)).data; }
  async actualizarCliente(id: number, data: CrearClienteRequest) { return (await api.put<Cliente>(`/clientes/${id}`, data)).data; }
  async eliminarCliente(id: number) { await api.delete(`/clientes/${id}`); }

  // --- EMPLEADOS ---
  async obtenerEmpleados() { return (await api.get<Empleado[]>("/empleados/")).data; }
  async crearEmpleado(data: CrearEmpleadoRequest) { return (await api.post<Empleado>("/empleados/", data)).data; }
  async actualizarEmpleado(id: number, data: CrearEmpleadoRequest) { return (await api.put<Empleado>(`/empleados/${id}`, data)).data; }
  async eliminarEmpleado(id: number | string) { await api.delete(`/empleados/${id}`); }

  // --- RESERVAS ---
  async obtenerReservas() { return (await api.get<Reserva[]>("/reservas/")).data; }
  async crearReserva(data: CrearReservaRequest) { return (await api.post<Reserva>("/reservas/", data)).data; }
  async actualizarReserva(id: number, data: CrearReservaRequest) { return (await api.put<Reserva>(`/reservas/${id}`, data)).data; }
  async eliminarReserva(id: number) { await api.delete(`/reservas/${id}`); }
  
  async obtenerDisponibilidad(salaId: number, fecha: string) {
    return (await api.get<DisponibilidadResponse>(`/disponibilidad/?sala_id=${salaId}&fecha=${fecha}`)).data;
  }
}