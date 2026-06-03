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

export interface EscapeRoomRepository {
  // Salas
  obtenerSalas(): Promise<Sala[]>;
  crearSala(data: CrearSalaRequest): Promise<Sala>;
  actualizarSala(id: number, data: CrearSalaRequest): Promise<Sala>;
  eliminarSala(id: number): Promise<void>;

  // Clientes
  obtenerClientes(): Promise<Cliente[]>;
  crearCliente(data: CrearClienteRequest): Promise<Cliente>;
  actualizarCliente(id: number, data: CrearClienteRequest): Promise<Cliente>;
  eliminarCliente(id: number): Promise<void>;

  // Empleados
  obtenerEmpleados(): Promise<Empleado[]>;
  crearEmpleado(data: CrearEmpleadoRequest): Promise<Empleado>;
  actualizarEmpleado(id: number, data: CrearEmpleadoRequest): Promise<Empleado>;
  eliminarEmpleado(id: number | string): Promise<void>;

  // Reservas & Disponibilidad
  obtenerReservas(): Promise<Reserva[]>;
  crearReserva(data: CrearReservaRequest): Promise<Reserva>;
  actualizarReserva(id: number, data: CrearReservaRequest): Promise<Reserva>;
  eliminarReserva(id: number): Promise<void>;
  obtenerDisponibilidad(salaId: number, fecha: string): Promise<DisponibilidadResponse>;
}