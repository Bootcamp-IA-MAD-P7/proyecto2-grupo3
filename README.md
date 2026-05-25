# Proyecto 2- Grupo Nro. 3: Scape Rooms

## Se generan las siguientes tablas en el proyecto (ver archivo script_tablas_BBDD.sql para mayor detalle):

* salas
* clientes
* empleados
* reservas
* registros_partidas
* detalle_jugadores_partida

## 🗺️ Mapa de Relaciones (Cardinalidad)

| Tabla origen | Relación | Descripción | Tipo FK |
|:---|:---:|:---|:---:|
| `reservas` → `salas` | N : 1 | Una sala puede tener muchas reservas | `ON DELETE RESTRICT` |
| `reservas` → `clientes` | N : 1 | Un cliente puede tener muchas reservas | `ON DELETE CASCADE` |
| `reservas` → `empleados` | N : 1 | Un empleado puede gestionar muchas reservas | `ON DELETE SET NULL` |
| `registros_partidas` → `reservas` | 1 : 1 | Una reserva genera exactamente una partida | `ON DELETE CASCADE` |
| `detalles_jugadores_partida` → `registros_partidas` | N : 1 | Una partida puede tener muchos jugadores registrados | `ON DELETE CASCADE` |
| `detalles_jugadores_partida` → `clientes` | N : 1 | Un cliente puede participar en muchas partidas | `ON DELETE CASCADE` |

## Diagrama ER:

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