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