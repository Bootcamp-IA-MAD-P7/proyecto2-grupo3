# Contexto de negocio y análisis del proyecto

## API REST - Sistema de gestión para escape rooms



1. OBJETIVO DEL PROYECTO
--------------------------------------------------

El objetivo del proyecto es desarrollar una API REST para la gestión integral de Escape Rooms, permitiendo digitalizar y centralizar los procesos operativos y de reservas del negocio.

El proyecto toma como referencia operativa negocios reales del sector como The Hive Escape Room, donde diariamente se gestionan múltiples sesiones, grupos, horarios y reservas simultáneas.

Referencia del negocio:
https://thehive.barcelona/

Actualmente muchos Escape Rooms pequeños y medianos gestionan sus operaciones de forma manual mediante herramientas no integradas como:

- WhatsApp
- Excel
- llamadas telefónicas
- agendas
- notas manuales

Este modelo genera errores frecuentes, pérdida de tiempo y dificultades para escalar la operación.


2. PROBLEMÁTICA ACTUAL DEL SECTOR
--------------------------------------------------

Los principales problemas detectados en la gestión actual son:

- dobles reservas
- sobreocupaciones
- pérdida de información
- errores en disponibilidad
- dificultad para gestionar cancelaciones
- poca trazabilidad operativa
- mala organización de clientes y grupos
- problemas de facturación
- dificultad para obtener métricas reales del negocio

Muchos Escape Rooms dependen todavía de procesos manuales o soluciones parciales que no cubren las necesidades reales del negocio.


3. COMPETENCIA Y SOFTWARE EXISTENTE
--------------------------------------------------

Actualmente existen plataformas especializadas para Escape Rooms como:

- Escape Up
- 4Escape

Estas herramientas funcionan principalmente como motores de reserva y gestión de sesiones.

Sin embargo, presentan varias limitaciones operativas importantes:

- interfaces poco intuitivas
- sistemas rígidos
- dificultad para adaptar lógica personalizada
- gestión centrada únicamente en IDs de sesión
- poca orientación al historial real del cliente
- problemas de trazabilidad
- dificultades para gestionar facturación correctamente
- poca flexibilidad para administrar grupos, pagos y estados complejos

En muchos casos la reserva queda asociada únicamente a una sesión concreta, sin una estructura sólida orientada a:

- clientes
- historial
- grupos
- pagos
- trazabilidad administrativa

Esto dificulta tanto la operación diaria como el crecimiento futuro del negocio.


4. PROPUESTA DEL PROYECTO
--------------------------------------------------

El proyecto busca crear una arquitectura más limpia, escalable y alineada con la realidad operativa de un Escape Room.

La API permitirá gestionar:

- reservas
- clientes
- salas
- horarios
- disponibilidad
- estados de reserva
- control de capacidad

Además, el sistema incorporará lógica real del negocio Escape Room:

- sesiones horarias
- idiomas
- grupos
- capacidad mínima y máxima
- pagos y señales
- cancelaciones
... (80 líneas restantes)