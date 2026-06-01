# Contexto de negocio y análisis del proyecto

## API REST - Sistema de gestión para escape rooms

## 1. Objetivo del proyecto

El objetivo del proyecto es desarrollar una API REST para la gestión integral de escape rooms, permitiendo digitalizar y centralizar los procesos operativos y de reservas del negocio.

El proyecto toma como referencia operativa negocios reales del sector como The Hive Escape Room, donde diariamente se gestionan múltiples sesiones, grupos, horarios y reservas simultáneas.

Referencia del negocio:

[The Hive Escape Room](https://thehive.barcelona/)

Actualmente, muchos escape rooms pequeños y medianos gestionan sus operaciones de forma manual mediante herramientas no integradas como:

- WhatsApp.
- Excel.
- Llamadas telefónicas.
- Agendas.
- Notas manuales.

Este modelo genera errores frecuentes, pérdida de tiempo y dificultades para escalar la operación.

## 2. Problemática actual del sector

Los principales problemas detectados en la gestión actual son:

- Dobles reservas.
- Sobreocupaciones.
- Pérdida de información.
- Errores en disponibilidad.
- Dificultad para gestionar cancelaciones.
- Poca trazabilidad operativa.
- Mala organización de clientes y grupos.
- Problemas de facturación.
- Dificultad para obtener métricas reales del negocio.

Muchos escape rooms dependen todavía de procesos manuales o soluciones parciales que no cubren las necesidades reales del negocio.

## 3. Competencia y software existente

Actualmente existen plataformas especializadas para escape rooms como:

- Escape Up.
- 4Escape.

Estas herramientas funcionan principalmente como motores de reserva y gestión de sesiones.

Sin embargo, presentan varias limitaciones operativas importantes:

- Interfaces poco intuitivas.
- Sistemas rígidos.
- Dificultad para adaptar lógica personalizada.
- Gestión centrada únicamente en IDs de sesión.
- Poca orientación al historial real del cliente.
- Problemas de trazabilidad.
- Dificultades para gestionar facturación correctamente.
- Poca flexibilidad para administrar grupos, pagos y estados complejos.

En muchos casos, la reserva queda asociada únicamente a una sesión concreta, sin una estructura sólida orientada a:

- Clientes.
- Historial.
- Grupos.
- Pagos.
- Trazabilidad administrativa.

Esto dificulta tanto la operación diaria como el crecimiento futuro del negocio.

## 4. Propuesta del proyecto

El proyecto busca crear una arquitectura más limpia, escalable y alineada con la realidad operativa de un escape room.

La API permitirá gestionar:

- Reservas.
- Clientes.
- Salas.
- Horarios.
- Disponibilidad.
- Estados de reserva.
- Control de capacidad.

Además, el sistema incorporará lógica real del negocio de escape rooms:

- Sesiones horarias.
- Idiomas.
- Grupos.
- Capacidad mínima y máxima.
- Pagos y señales.
- Cancelaciones.
- Disponibilidad real.
- Estados operativos de reserva.

El objetivo no es únicamente construir un CRUD técnico, sino una solución preparada para las necesidades reales del sector.

## 5. Enfoque diferencial

La propuesta se basa en estructurar correctamente las relaciones entre:

- Cliente.
- Grupo.
- Reserva.
- Sesión.
- Sala.
- Pago.
- Estado.

Esto permitirá:

- Mejorar la trazabilidad.
- Evitar errores operativos.
- Facilitar la facturación.
- Mejorar la organización interna.
- Preparar el negocio para crecer.
- Permitir futuras automatizaciones.

## 6. Objetivos técnicos

Durante el desarrollo trabajaremos en las siguientes áreas:

### Backend y base de datos

- Base de datos SQL.
- Modelado relacional.
- Diseño de entidades y relaciones.

### API REST

- Endpoints CRUD.
- Arquitectura RESTful.
- Validaciones.
- Manejo de errores HTTP.

### Documentación y testing

- Swagger/OpenAPI.
- Documentación interactiva.
- Tests funcionales.
- Documentación técnica.

### Metodología y organización

- GitHub.
- Trabajo con ramas.
- Metodología SCRUM.
- Gestión mediante Jira.
- Control colaborativo del proyecto.

## 7. Visión futura

La arquitectura debe permitir evolucionar posteriormente hacia:

- Panel de administración.
- Autenticación y roles.
- Pagos online.
- Estadísticas.
- Reporting.
- CRM.
- Automatización de emails.
- Integraciones web.
- Analítica de negocio.

El objetivo final es construir una base sólida y profesional sobre la que pueda crecer un sistema real de gestión para escape rooms.

### Evoluciones funcionales identificadas desde la perspectiva de negocio

Además de las líneas de evolución ya identificadas, se consideran de interés las siguientes funcionalidades para futuras iteraciones del producto. Estas observaciones se basan en la operativa habitual de negocios de Escape Room y no forman parte del alcance del MVP actual.

#### Gestión de disponibilidad

- Implementación de disponibilidad basada en slots horarios predefinidos.
- Configuración de slots por sala (ejemplo: 8 slots diarios).
- Configuración de días operativos por sala.
- Bloqueo automático de slots reservados.
- Gestión de estados de disponibilidad:
  - Disponible.
  - Reservado.
  - Bloqueado.
  - Mantenimiento.
- Visualización de disponibilidad mediante calendario.

#### Gestión de sedes

- Incorporación de una entidad **Sede**.
- Asociación de salas a una sede.
- Asociación de empleados a una sede.
- Gestión independiente de disponibilidad y operación por sede.

Ejemplo:

- Sede 1.
- Sede 2.

#### Gestión de salas

Cada sala podría disponer de configuración propia:

- Nombre.
- Temática.
- Capacidad máxima.
- Precio.
- Duración de la experiencia.
- Días operativos.
- Slots disponibles.
- Estado operativo.

#### Gestión de reservas

- Reserva vinculada a una sede y una sala.
- Selección de fecha y slot horario disponible.
- Prevención de reservas duplicadas.
- Gestión de estados:
  - Pendiente.
  - Confirmada.
  - Modificada.
  - Cancelada.
  - Completada.
  - No Show.

#### Gestión de pagos

Adaptación del sistema a la operativa habitual del negocio:

- Registro de señal de reserva (ejemplo: 20 €).
- Registro de importe pendiente.
- Estado del pago.
- Fecha de cobro.
- Método de pago.
- Referencia de transacción.

#### Comunicaciones automáticas

- Envío de email de confirmación de reserva.
- Envío de recordatorio 48 horas antes.
- Envío de recordatorio 24 horas antes.
- Inclusión de información operativa y normativa en los correos.
- Inclusión de enlaces a formularios o documentación previa.

#### Gestión documental

- Asociación de formularios legales a la reserva.
- Registro de aceptación de condiciones.
- Seguimiento del estado de cumplimentación.

#### Gestión de empleados / Game Masters

- Incorporación de entidad Empleado o Game Master.
- Asignación de reservas a empleados.
- Control de disponibilidad.
- Control de capacidad máxima diaria de sesiones.
- Prevención de sobreasignaciones.
- Historial de sesiones gestionadas.

#### Gestión de usuarios y trazabilidad

- Incorporación de autenticación mediante usuario y contraseña.
- Gestión de perfiles y roles de acceso.
- Asociación de acciones realizadas a un usuario concreto.
- Registro de auditoría sobre operaciones críticas.

Información trazable sugerida:

- Usuario que creó una reserva.
- Usuario que modificó una reserva.
- Usuario que canceló una reserva.
- Fecha y hora de cada acción.
- Historial de cambios por reserva.
- Registro de valores anteriores y nuevos en modificaciones relevantes.

Beneficios:

- Mayor trazabilidad operativa.
- Identificación de responsables de cada acción.
- Reducción de errores operativos.
- Facilita auditorías internas.
- Mejora la gestión de incidencias y reclamaciones.

#### Integración con web pública

- Consumo del mismo motor de reservas desde web pública y panel interno.
- Consulta de disponibilidad en tiempo real.
- Creación de reservas desde web.
- Gestión automática del bloqueo de slots.

Flujo esperado:

1. Selección de sede.
2. Selección de sala.
3. Selección de fecha.
4. Selección de slot disponible.
5. Confirmación de reserva.
6. Pago de señal.

#### Operación diaria

- Vista consolidada de reservas del día.
- Sala asignada.
- Cliente.
- Número de jugadores.
- Estado del pago.
- Game Master asignado.
- Observaciones operativas.

#### Métricas e indicadores

- Ocupación por sala.
- Ocupación por sede.
- Ingresos por período.
- Reservas por canal.
- Cancelaciones.
- Rendimiento por franja horaria.

> Nota: Estas funcionalidades se documentan como posibles evoluciones futuras identificadas a partir de la operativa habitual de negocios de Escape Room y no forman parte del alcance del MVP actualmente implementado.