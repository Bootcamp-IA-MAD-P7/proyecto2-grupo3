import type {
  Cliente, ClienteConReservas, CrearClienteRequest,
  CrearEmpleadoRequest,
  CrearReservaRequest,
  CrearSalaRequest,
  DisponibilidadResponse,
  Empleado,
  PaginatedResponse,
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
  eliminarEmpleado(id: number): Promise<void>;

  // Reservas & Disponibilidad
  obtenerReservas(): Promise<Reserva[]>;
  crearReserva(data: CrearReservaRequest): Promise<Reserva>;
  actualizarReserva(id: number, data: CrearReservaRequest): Promise<Reserva>;
  eliminarReserva(id: number): Promise<void>;
  obtenerDisponibilidad(salaId: number, fecha: string): Promise<DisponibilidadResponse>;

  // Búsqueda con paginación y filtros
  buscarReservas(params: Record<string, string | number>, page?: number, limit?: number): Promise<PaginatedResponse<Reserva>>;
  buscarSalas(params: Record<string, string>, page?: number, limit?: number): Promise<PaginatedResponse<Sala>>;
  buscarClientes(params: Record<string, string>, page?: number, limit?: number): Promise<PaginatedResponse<Cliente>>;
  obtenerClienteConReservas(id: number): Promise<ClienteConReservas>;
  buscarEmpleados(params: Record<string, string | boolean>, page?: number, limit?: number): Promise<PaginatedResponse<Empleado>>;
}