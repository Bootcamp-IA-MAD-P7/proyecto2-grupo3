-- ==========================================
-- CREACIÓN DE TABLAS
-- ==========================================

-- 1. Tabla de Salas
CREATE TABLE salas (
    id_sala SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tematica VARCHAR(100) NOT NULL,
    dificultad VARCHAR(50) CHECK (dificultad IN ('Fácil', 'Medio', 'Difícil', 'Experto')),
    capacidad_max INT NOT NULL,
    precio NUMERIC(6, 2) NOT NULL
);

-- 2. Tabla de Clientes
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Empleados
CREATE TABLE empleados (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(20) NOT NULL,
    rol VARCHAR(50) DEFAULT 'Game Master',
    activo BOOLEAN DEFAULT TRUE
);

-- 4. Tabla de Reservas
CREATE TABLE reservas (
    id_reserva SERIAL PRIMARY KEY,
    id_sala INT REFERENCES salas(id_sala) ON DELETE RESTRICT,
    id_cliente INT REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    id_empleado INT REFERENCES empleados(id_empleado) ON DELETE SET NULL,
    fecha_hora TIMESTAMP NOT NULL,
    numero_jugadores INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'Confirmada' CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada')),
    total_pagado NUMERIC(6, 2) NOT NULL
);

-- 5. Tabla de Notas de Partida
CREATE TABLE registros_partidas (
    id_partida SERIAL PRIMARY KEY,
    id_reserva INT UNIQUE REFERENCES reservas(id_reserva) ON DELETE CASCADE,
    fecha_partida DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tiempo_escape INTERVAL GENERATED ALWAYS AS (hora_fin - hora_inicio) STORED,
    escaparon BOOLEAN NOT NULL,
    notas_game_master TEXT
);

-- 6. Tabla de Jugadores por Partida
CREATE TABLE detalles_jugadores_partida (
    id_detalle SERIAL PRIMARY KEY,
    id_partida INT REFERENCES registros_partidas(id_partida) ON DELETE CASCADE,
    id_cliente INT REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    CONSTRAINT unica_participacion UNIQUE (id_partida, id_cliente)
);

-- ==========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ==========================================
CREATE INDEX idx_reservas_fecha_hora ON reservas(fecha_hora);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_sala ON reservas(id_sala);
CREATE INDEX idx_reservas_cliente ON reservas(id_cliente);
CREATE INDEX idx_reservas_empleado ON reservas(id_empleado);
CREATE INDEX idx_registros_fecha_partida ON registros_partidas(fecha_partida);
CREATE INDEX idx_detalles_jugadores_cliente ON detalles_jugadores_partida(id_cliente);
CREATE INDEX idx_clientes_apellido ON clientes(apellido);
CREATE INDEX idx_empleados_apellido ON empleados(apellido);