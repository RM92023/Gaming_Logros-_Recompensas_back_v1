-- ====================================
-- PLAYER_DB - Schema y Datos de Seed
-- ====================================
-- Ejecutar este script en la base de datos: player_db
-- Usuario: postgres / Contraseña: root

-- LIMPIAR DATOS EXISTENTES
TRUNCATE TABLE players CASCADE;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla players
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    "monstersKilled" INTEGER DEFAULT 0,
    "timePlayed" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar jugadores de prueba
INSERT INTO players (id, username, email, "monstersKilled", "timePlayed", "isActive", "createdAt", "updatedAt")
VALUES
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'player_one', 'player1@example.com', 25, 120, TRUE, NOW(), NOW()),
    ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'player_two', 'player2@example.com', 50, 300, TRUE, NOW(), NOW()),
    ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'gamer_master', 'gamer@example.com', 100, 600, TRUE, NOW(), NOW()),
    ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'rookie_player', 'rookie@example.com', 5, 30, TRUE, NOW(), NOW()),
    ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'veteran_gamer', 'veteran@example.com', 150, 900, TRUE, NOW(), NOW()),
    ('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', 'speedrunner', 'speed@example.com', 75, 180, TRUE, NOW(), NOW()),
    ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 'casual_player', 'casual@example.com', 10, 60, TRUE, NOW(), NOW()),
    ('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 'pro_hunter', 'prohunter@example.com', 200, 1200, TRUE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verificar datos insertados
SELECT COUNT(*) as total_players FROM players;
SELECT username, email, "monstersKilled", "timePlayed" FROM players ORDER BY "monstersKilled" DESC LIMIT 5;
