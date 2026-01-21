-- ====================================
-- REWARD_DB - Schema y Datos de Seed
-- ====================================
-- Ejecutar este script en la base de datos: reward_db
-- Usuario: postgres / Contraseña: root

-- LIMPIAR DATOS EXISTENTES
TRUNCATE TABLE rewards CASCADE;
TRUNCATE TABLE player_balances CASCADE;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipo ENUM para reward_type
DO $$ BEGIN
    CREATE TYPE reward_type AS ENUM ('coins', 'points', 'badge', 'item');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear tabla rewards
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    reward_type reward_type NOT NULL,
    reward_amount INTEGER NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_claimed BOOLEAN DEFAULT FALSE
);

-- Crear tabla player_balances
CREATE TABLE IF NOT EXISTS player_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID UNIQUE NOT NULL,
    total_coins INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_rewards_player_id ON rewards(player_id);
CREATE INDEX IF NOT EXISTS idx_rewards_achievement_id ON rewards(achievement_id);
CREATE INDEX IF NOT EXISTS idx_player_balances_player_id ON player_balances(player_id);

-- Insertar balances iniciales para todos los jugadores
-- Estos IDs coinciden con los del script seed-player-db.sql
INSERT INTO player_balances (id, player_id, total_coins, total_points, last_updated)
VALUES
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 0, 0, NOW()), -- player_one
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 0, 0, NOW()), -- player_two
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 0, 0, NOW()), -- gamer_master
    (uuid_generate_v4(), 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 0, 0, NOW()), -- rookie_player
    (uuid_generate_v4(), 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 0, 0, NOW()), -- veteran_gamer
    (uuid_generate_v4(), 'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', 0, 0, NOW()), -- speedrunner
    (uuid_generate_v4(), 'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 0, 0, NOW()), -- casual_player
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 0, 0, NOW())  -- pro_hunter
ON CONFLICT (player_id) DO NOTHING;

-- Insertar rewards para achievements desbloqueados
-- Player 1 (player_one) - 5 achievements unlocked
INSERT INTO rewards (id, player_id, achievement_id, reward_type, reward_amount, awarded_at, is_claimed)
VALUES
    -- Player 1 rewards
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 'coins', 100, NOW() - INTERVAL '5 days', TRUE),
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '89c7e129-903f-44af-afa7-0b00b569817f', 'coins', 150, NOW() - INTERVAL '3 days', TRUE),
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 'coins', 200, NOW() - INTERVAL '1 day', TRUE),
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 'coins', 250, NOW() - INTERVAL '6 hours', FALSE),
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 'coins', 300, NOW() - INTERVAL '2 hours', FALSE),
    
    -- Player 2 rewards (player_two)
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 'coins', 100, NOW() - INTERVAL '10 days', TRUE),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '89c7e129-903f-44af-afa7-0b00b569817f', 'coins', 150, NOW() - INTERVAL '8 days', TRUE),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 'coins', 200, NOW() - INTERVAL '6 days', TRUE),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 'coins', 250, NOW() - INTERVAL '4 days', TRUE),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 'coins', 300, NOW() - INTERVAL '1 day', FALSE),
    
    -- Player 3 rewards (gamer_master)
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 'coins', 100, NOW() - INTERVAL '20 days', TRUE),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '89c7e129-903f-44af-afa7-0b00b569817f', 'coins', 150, NOW() - INTERVAL '18 days', TRUE),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 'coins', 200, NOW() - INTERVAL '15 days', TRUE),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 'coins', 250, NOW() - INTERVAL '12 days', TRUE),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 'coins', 300, NOW() - INTERVAL '5 days', FALSE),
    
    -- Player 4 rewards (rookie_player)
    (uuid_generate_v4(), 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 'coins', 100, NOW() - INTERVAL '2 days', TRUE),
    
    -- Player 8 rewards (pro_hunter)
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 'coins', 100, NOW() - INTERVAL '30 days', TRUE),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '89c7e129-903f-44af-afa7-0b00b569817f', 'coins', 150, NOW() - INTERVAL '28 days', TRUE),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 'coins', 200, NOW() - INTERVAL '25 days', TRUE),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 'coins', 250, NOW() - INTERVAL '22 days', TRUE),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 'coins', 300, NOW() - INTERVAL '10 days', TRUE)
ON CONFLICT DO NOTHING;

-- Actualizar balances basados en rewards reclamadas
UPDATE player_balances pb
SET total_coins = (
    SELECT COALESCE(SUM(r.reward_amount), 0)
    FROM rewards r
    WHERE r.player_id = pb.player_id 
    AND r.is_claimed = TRUE 
    AND r.reward_type = 'coins'
),
total_points = (
    SELECT COALESCE(SUM(r.reward_amount), 0)
    FROM rewards r
    WHERE r.player_id = pb.player_id 
    AND r.is_claimed = TRUE 
    AND r.reward_type = 'points'
),
last_updated = NOW();

-- Verificar datos insertados
SELECT COUNT(*) as total_rewards FROM rewards;
SELECT player_id, COUNT(*) as rewards_count, SUM(CASE WHEN is_claimed THEN 1 ELSE 0 END) as claimed_count
FROM rewards
GROUP BY player_id
ORDER BY rewards_count DESC;

SELECT COUNT(*) as total_player_balances FROM player_balances;
SELECT player_id, total_coins, total_points FROM player_balances ORDER BY total_coins DESC;
