# Proyecto 2 - Grupo 3: Sistema de Gestión para Escape Rooms

## Descripción

Este proyecto consiste en el desarrollo de una API REST para la gestión integral de un negocio de escape rooms.

La aplicación tiene como objetivo digitalizar y centralizar procesos operativos que habitualmente se gestionan de forma manual o mediante herramientas no integradas, como WhatsApp, Excel, llamadas telefónicas, agendas o notas internas.

El sistema permitirá gestionar reservas, clientes, salas, empleados, partidas y jugadores, facilitando una administración más organizada, trazable y escalable del negocio.

## Contexto de negocio

El proyecto toma como referencia operativa negocios reales del sector, como The Hive Escape Room:

https://thehive.barcelona/

En muchos escape rooms pequeños y medianos, la gestión diaria depende todavía de procesos manuales o soluciones parciales. Esto puede provocar problemas como:

- Dobles reservas.
- Errores en la disponibilidad.
- Pérdida de información.
- Dificultad para gestionar cancelaciones.
- Falta de trazabilidad operativa.
- Mala organización de clientes y grupos.
- Problemas en la gestión de pagos o señales.
- Dificultad para obtener métricas reales del negocio.

Aunque existen plataformas especializadas en el sector, como Escape Up o 4Escape, muchas de estas soluciones están centradas principalmente en motores de reserva y pueden resultar rígidas para ciertas necesidades operativas.

Este proyecto propone una arquitectura más flexible y personalizada, orientada no solo a gestionar sesiones, sino también a mantener información estructurada sobre clientes, reservas, salas, empleados, partidas y participantes.

Para consultar el análisis completo del contexto de negocio, ver:

[docs/business-context.md](docs/business-context.md)

## Objetivo del proyecto

Desarrollar una API REST con base de datos relacional que permita gestionar de forma eficiente un negocio de escape rooms.

El sistema busca cumplir los requisitos técnicos del briefing académico:

- Diseño de base de datos SQL.
- API REST con operaciones CRUD.
- Documentación de la API.
- Tests unitarios y de integración.
- Control de versiones con Git y GitHub.
- Gestión del proyecto mediante SCRUM en Jira.
- Documentación del proceso de trabajo.

## Metodología de trabajo

El proyecto se gestiona mediante metodología SCRUM utilizando Jira.

Se han definido dos sprints principales:

| Sprint | Fechas | Objetivo |
|---|---|---|
| Sprint 1 - MVP Esencial | 25/05/2026 - 29/05/2026 | Construir un primer MVP funcional que cumpla el Nivel Esencial del briefing. |
| Sprint 2 - Mejora, Experto y Cierre | 01/06/2026 - 04/06/2026 | Añadir mejoras de Nivel Medio, Avanzado y Experto, reforzar tests, documentación y preparar la entrega final. |

Tablero Jira del proyecto:

https://miguel-redondo.atlassian.net/jira/software/projects/P2G3S/boards/34/backlog

La documentación SCRUM del proyecto se encuentra en:

```text
docs/scrum/
```

Las dailys se documentan en:

```text
docs/scrum/dailys/
```

## Tecnologías previstas

Las tecnologías principales del proyecto son:

- Python.
- FastAPI.
- Base de datos SQL.
- SQLAlchemy o equivalente ORM.
- Swagger/OpenAPI para documentación interactiva.
- Pytest para testing.
- Git y GitHub para control de versiones.
- Jira para gestión SCRUM.
- Docker como objetivo de Nivel Experto.

## Estructura del proyecto

La estructura inicial del proyecto se plantea separando responsabilidades por capas para facilitar el trabajo en equipo y reducir conflictos durante el desarrollo.

```text
backend/
├── controllers/
│   └── game_controller.py
├── core/
│   ├── config.py
│   ├── constants.py
│   └── database.py
├── models/
├── schemas/
│   └── messages.py
├── services/
│   ├── elevenlabs_service.py
│   └── ws_manager.py
├── .env.example
├── Dockerfile
├── main.py
├── requirements.txt
└── test_ws.py

frontend/
```

### Criterio de organización

- `controllers/`: gestión de rutas y controladores de la API.
- `core/`: configuración principal, constantes y conexión con base de datos.
- `models/`: modelos de datos y entidades principales.
- `schemas/`: validación y estructura de datos de entrada y salida.
- `services/`: lógica de negocio y servicios externos.
- `main.py`: punto de entrada de la aplicación.
- `.env.example`: plantilla de variables de entorno necesarias para ejecutar el proyecto.
- `Dockerfile`: configuración para contenedorización.
- `frontend/`: espacio reservado para una posible interfaz básica.

El archivo `.env` se utilizará solo en local y no debe subirse al repositorio. Las carpetas generadas automáticamente, como `__pycache__` o `.pytest_cache`, deben quedar excluidas mediante `.gitignore`.

Esta estructura permite dividir el trabajo por módulos y minimizar conflictos al trabajar con ramas diferentes.

## Modelo de datos

El modelo inicial de base de datos contempla las siguientes tablas:

- `salas`
- `clientes`
- `empleados`
- `reservas`
- `registros_partidas`
- `detalles_jugadores_partida`

Para más detalle, consultar el archivo:

```text
script_tablas_BBDD.sql
```

## Mapa de relaciones

| Tabla origen | Relación | Descripción | Tipo FK |
|:---|:---:|:---|:---:|
| `reservas` -> `salas` | N : 1 | Una sala puede tener muchas reservas | `ON DELETE RESTRICT` |
| `reservas` -> `clientes` | N : 1 | Un cliente puede tener muchas reservas | `ON DELETE CASCADE` |
| `reservas` -> `empleados` | N : 1 | Un empleado puede gestionar muchas reservas | `ON DELETE SET NULL` |
| `registros_partidas` -> `reservas` | 1 : 1 | Una reserva genera exactamente una partida | `ON DELETE CASCADE` |
| `detalles_jugadores_partida` -> `registros_partidas` | N : 1 | Una partida puede tener muchos jugadores registrados | `ON DELETE CASCADE` |
| `detalles_jugadores_partida` -> `clientes` | N : 1 | Un cliente puede participar en muchas partidas | `ON DELETE CASCADE` |

## Diagrama ER

```mermaid
erDiagram
  salas {
    serial id_sala PK
    varchar nombre
    varchar tematica
    varchar dificultad
    int capacidad_max
    numeric precio
  }

  clientes {
    serial id_cliente PK
    varchar nombre
    varchar apellido
    varchar email
    varchar telefono
    timestamp fecha_registro
  }

  empleados {
    serial id_empleado PK
    varchar nombre
    varchar apellido
    varchar rol
    boolean activo
  }

  reservas {
    serial id_reserva PK
    int id_sala FK
    int id_cliente FK
    int id_empleado FK
    timestamp fecha_hora
    int numero_jugadores
    varchar estado
    numeric total_pagado
  }

  registros_partidas {
    serial id_partida PK
    int id_reserva FK
    date fecha_partida
    time hora_inicio
    time hora_fin
    interval tiempo_escape
    boolean escaparon
    text notas_game_master
  }

  detalles_jugadores_partida {
    serial id_detalle PK
    int id_partida FK
    int id_cliente FK
  }

  salas ||--o{ reservas : "tiene"
  clientes ||--o{ reservas : "realiza"
  empleados ||--o{ reservas : "gestiona"
  reservas ||--|| registros_partidas : "genera"
  registros_partidas ||--o{ detalles_jugadores_partida : "incluye"
  clientes ||--o{ detalles_jugadores_partida : "participa en"
```

## Funcionalidades previstas

### Nivel Esencial

- Base de datos con mínimo 3 tablas relacionadas.
- API REST con operaciones CRUD básicas.
- Tests unitarios para endpoints.
- Documentación en Markdown.
- Gestión del proyecto mediante Jira.
- Variables de entorno para datos sensibles.
- Logging básico.
- Manejo simple de excepciones.

### Nivel Medio

- Base de datos con 5 o más tablas.
- Documentación interactiva con Swagger.
- Manejo de errores con códigos HTTP adecuados.
- Exportación de datos a CSV.
- Filtrado y paginación en endpoints GET.

### Nivel Avanzado

- Autenticación mediante JWT.
- Roles de usuario y permisos.
- Protección de endpoints.

### Nivel Experto

- Contenedorización con Docker.
- Posible despliegue en la nube.
- Posible interfaz básica o integración externa.

## Instalación

Pendiente de completar durante el desarrollo del Sprint 1.

## Variables de entorno

El proyecto utilizará variables de entorno para almacenar configuración sensible.

Ejemplo previsto:

```text
DATABASE_URL=
SECRET_KEY=
ENVIRONMENT=
```

El archivo de referencia será:

```text
.env.example
```

## Ejecución de la API

Pendiente de completar cuando esté definida la estructura final del backend.

## Documentación de la API

La API se documentará mediante Swagger/OpenAPI.

Cuando la aplicación esté en ejecución, la documentación estará disponible en una ruta similar a:

```text
/docs
```

## Tests

La suite de tests se desarrollará con Pytest o herramienta equivalente.

Pendiente de completar con el comando final de ejecución.

## Equipo

Proyecto desarrollado por el Grupo 3 dentro del segundo proyecto académico del bootcamp.

## Estado del proyecto

Proyecto en desarrollo.

Sprint actual:

```text
Sprint 1 - MVP Esencial
25/05/2026 - 29/05/2026
```

