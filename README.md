# Proyecto 2 - Grupo 3: Sistema de Gestión para Escape Rooms

## Descripción

Este proyecto consiste en el desarrollo de una API REST para la gestión integral de un negocio de escape rooms.

La aplicación tiene como objetivo digitalizar y centralizar procesos operativos que habitualmente se gestionan de forma manual o mediante herramientas no integradas, como WhatsApp, Excel, llamadas telefónicas, agendas o notas internas.

El sistema permitirá gestionar reservas, clientes, salas, sesiones y jugadores, facilitando una administración más organizada, trazable y escalable del negocio.

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

Este proyecto propone una arquitectura más flexible y personalizada, orientada no solo a gestionar sesiones, sino también a mantener información estructurada sobre clientes, salas, sesiones, reservas y participantes.

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

## Tecnologías

Las tecnologías principales del proyecto son:

- Python.
- FastAPI.
- PostgreSQL.
- SQLAlchemy.
- Pydantic Settings.
- Swagger/OpenAPI para documentación interactiva.
- Pytest para testing.
- Git y GitHub para control de versiones.
- Jira para gestión SCRUM.
- Docker como objetivo de Nivel Experto.

## Estructura del proyecto

La estructura inicial del proyecto separa responsabilidades por capas para facilitar el trabajo en equipo y reducir conflictos durante el desarrollo.

```text
backend/
├── core/
│   ├── config.py
│   └── database.py
├── models/
│   ├── cliente.py
│   ├── reserva.py
│   ├── sala.py
│   └── sesion.py
├── schemas/
│   ├── cliente.py
│   ├── reserva.py
│   ├── sala.py
│   └── sesion.py
├── .env.example
├── main.py
└── requirements.txt

docs/
├── business-context.md
└── scrum/
    └── dailys/
```

### Criterio de organización

- `backend/core/`: configuración principal y conexión con base de datos.
- `backend/models/`: modelos SQLAlchemy que representan las tablas principales.
- `backend/schemas/`: schemas Pydantic para validar entrada y salida de datos.
- `backend/main.py`: punto de entrada de la aplicación FastAPI.
- `backend/.env.example`: plantilla de variables de entorno necesarias para ejecutar el proyecto.
- `backend/requirements.txt`: dependencias necesarias para instalar el backend.
- `docs/`: documentación del proyecto, contexto de negocio y seguimiento SCRUM.

El archivo `backend/.env` se utiliza solo en local y no debe subirse al repositorio. Las carpetas generadas automáticamente, como `__pycache__`, `.pytest_cache`, `.venv` o `.vscode`, deben quedar excluidas mediante `.gitignore`.

## Modelo de datos

Para el MVP esencial se priorizan las siguientes entidades:

- `salas`
- `clientes`
- `sesiones`
- `reservas`

Relaciones principales del MVP:

- Una sala puede tener muchas sesiones.
- Un cliente puede tener muchas reservas.
- Una sesión puede tener muchas reservas.
- Una reserva pertenece a un cliente y a una sesión.

El modelo inicial ampliado también contempla entidades como empleados, registros de partidas y detalles de jugadores de partida.

Para más detalle, consultar el archivo:

```text
script_tablas_BBDD.sql
```

## Mapa de relaciones inicial

| Tabla origen | Relación | Descripción |
|:---|:---:|:---|
| `sesiones` -> `salas` | N : 1 | Una sala puede tener muchas sesiones. |
| `reservas` -> `clientes` | N : 1 | Un cliente puede tener muchas reservas. |
| `reservas` -> `sesiones` | N : 1 | Una sesión puede tener muchas reservas. |

## Diagrama ER inicial

```mermaid
erDiagram
  salas {
    int id PK
    varchar nombre
    int capacidad_min
    int capacidad_max
  }

  clientes {
    int id PK
    varchar nombre
    varchar email
    varchar telefono
  }

  sesiones {
    int id PK
    int sala_id FK
    datetime fecha_hora_inicio
  }

  reservas {
    int id PK
    int cliente_id FK
    int sesion_id FK
    int num_jugadores
    varchar estado
  }

  salas ||--o{ sesiones : "tiene"
  clientes ||--o{ reservas : "realiza"
  sesiones ||--o{ reservas : "recibe"
```

## Estado actual del backend

Actualmente el backend cuenta con:

- Aplicación FastAPI inicial.
- Endpoint de comprobación `GET /health`.
- Swagger disponible automáticamente en `/docs`.
- Conexión inicial a PostgreSQL preparada mediante SQLAlchemy.
- Configuración centralizada con Pydantic Settings.
- Modelos SQLAlchemy principales para `Sala`, `Cliente`, `Sesion` y `Reserva`.
- Schemas Pydantic principales para entrada y salida de datos.

Quedan pendientes dentro de la historia principal de API:

- Implementar endpoints CRUD básicos.
- Añadir manejo simple de errores y logging.

## Instalación

Crear y activar un entorno virtual local:

```bash
python -m venv .venv
source .venv/Scripts/activate
```

Instalar dependencias del backend:

```bash
pip install -r backend/requirements.txt
```

## Variables de entorno

El backend utiliza variables de entorno para almacenar configuración sensible.

El repositorio incluye el archivo de ejemplo:

```text
backend/.env.example
```

Cada persona debe crear localmente su propio archivo:

```text
backend/.env
```

Ejemplo de configuración:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/escape_rooms_db
ENVIRONMENT=development
```

El archivo `backend/.env` no debe subirse al repositorio.

## Ejecución de la API

Con el entorno virtual activado, ejecutar desde la raíz del proyecto:

```bash
uvicorn backend.main:app --reload
```

La API quedará disponible en:

```text
http://127.0.0.1:8000
```

Endpoint inicial de comprobación:

```text
GET http://127.0.0.1:8000/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

## Documentación de la API

FastAPI genera automáticamente la documentación Swagger/OpenAPI.

Con la aplicación en ejecución, Swagger está disponible en:

```text
http://127.0.0.1:8000/docs
```

La especificación OpenAPI está disponible en:

```text
http://127.0.0.1:8000/openapi.json
```

Actualmente Swagger muestra el endpoint inicial `GET /health`. La revisión completa de la documentación automática quedará pendiente hasta que se implementen los endpoints CRUD principales.

## Tests

La suite de tests se desarrollará con Pytest o herramienta equivalente.

Pendiente de completar con el comando final de ejecución cuando existan los primeros endpoints CRUD.

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

## Equipo

Proyecto desarrollado por el Grupo 3 dentro del segundo proyecto académico del bootcamp.

## Estado del proyecto

Proyecto en desarrollo.

Sprint actual:

```text
Sprint 1 - MVP Esencial
25/05/2026 - 29/05/2026
```
