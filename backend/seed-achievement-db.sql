-- ====================================
-- ACHIEVEMENT_DB - Schema y Datos de Seed
-- ====================================
-- Ejecutar este script en la base de datos: achievement_db
-- Usuario: postgres / Contraseña: root

-- LIMPIAR DATOS EXISTENTES (en orden correcto por foreign keys)
TRUNCATE TABLE player_achievements CASCADE;
TRUNCATE TABLE achievements CASCADE;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla achievements
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    title_key VARCHAR(255) NOT NULL,
    description_key VARCHAR(255) NOT NULL,
    required_value INTEGER NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    is_temporal BOOLEAN DEFAULT FALSE,
    temporal_window_start TIMESTAMP NULL,
    temporal_window_end TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    reward_points INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla player_achievements
CREATE TABLE IF NOT EXISTS player_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    progress INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_player_achievement UNIQUE (player_id, achievement_id),
    CONSTRAINT fk_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_id ON player_achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_achievement_id ON player_achievements(achievement_id);

-- Insertar achievements (logros) - Solo 5 logros de monstruos
INSERT INTO achievements (id, code, title_key, description_key, required_value, event_type, is_temporal, temporal_window_start, temporal_window_end, is_active, reward_points, created_at, updated_at)
VALUES
    ('0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 'FIRST_BLOOD', 'achievement.first_blood.title', 'achievement.first_blood.description', 3, 'MONSTER_KILLED', FALSE, NULL, NULL, TRUE, 100, NOW(), NOW()),
    ('89c7e129-903f-44af-afa7-0b00b569817f', 'MONSTER_SLAYER_6', 'achievement.monster_slayer_6.title', 'achievement.monster_slayer_6.description', 6, 'MONSTER_KILLED', FALSE, NULL, NULL, TRUE, 150, NOW(), NOW()),
    ('f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 'MONSTER_SLAYER_9', 'achievement.monster_slayer_9.title', 'achievement.monster_slayer_9.description', 9, 'MONSTER_KILLED', FALSE, NULL, NULL, TRUE, 200, NOW(), NOW()),
    ('7b4df42a-8539-41bc-9ae8-0651a3f091da', 'MONSTER_SLAYER_12', 'achievement.monster_slayer_12.title', 'achievement.monster_slayer_12.description', 12, 'MONSTER_KILLED', FALSE, NULL, NULL, TRUE, 250, NOW(), NOW()),
    ('1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 'MONSTER_SLAYER_15', 'achievement.monster_slayer_15.title', 'achievement.monster_slayer_15.description', 15, 'MONSTER_KILLED', FALSE, NULL, NULL, TRUE, 300, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Insertar progreso de achievements para algunos jugadores
-- Estos IDs de jugadores coinciden con los del script seed-player-db.sql
INSERT INTO player_achievements (id, player_id, achievement_id, progress, unlocked_at, created_at)
VALUES
    -- Player 1 (player_one) - 25 monsters killed
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'), -- FIRST_BLOOD unlocked
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '89c7e129-903f-44af-afa7-0b00b569817f', 6, NOW() - INTERVAL '3 days', NOW() - INTERVAL '5 days'), -- MONSTER_SLAYER_6 unlocked
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 9, NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 days'), -- MONSTER_SLAYER_9 unlocked
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 12, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 days'), -- MONSTER_SLAYER_12 unlocked
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 15, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '5 days'), -- MONSTER_SLAYER_15 unlocked
    
    -- Player 2 (player_two) - 50 monsters killed
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 3, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '89c7e129-903f-44af-afa7-0b00b569817f', 6, NOW() - INTERVAL '8 days', NOW() - INTERVAL '10 days'),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 9, NOW() - INTERVAL '6 days', NOW() - INTERVAL '10 days'),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 12, NOW() - INTERVAL '4 days', NOW() - INTERVAL '10 days'),
    (uuid_generate_v4(), 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 15, NOW() - INTERVAL '1 day', NOW() - INTERVAL '10 days'),
    
    -- Player 3 (gamer_master) - 100 monsters killed
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '89c7e129-903f-44af-afa7-0b00b569817f', 6, NOW() - INTERVAL '18 days', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 9, NOW() - INTERVAL '15 days', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 12, NOW() - INTERVAL '12 days', NOW() - INTERVAL '20 days'),
    (uuid_generate_v4(), 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 15, NOW() - INTERVAL '5 days', NOW() - INTERVAL '20 days'),
    
    -- Player 4 (rookie_player) - 5 monsters killed
    (uuid_generate_v4(), 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 3, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    (uuid_generate_v4(), 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', '89c7e129-903f-44af-afa7-0b00b569817f', 5, NULL, NOW() - INTERVAL '2 days'), -- In progress
    
    -- Player 8 (pro_hunter) - 200 monsters killed
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '0cc8e37f-3b5e-4997-b6e1-340c0e076b8c', 3, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '89c7e129-903f-44af-afa7-0b00b569817f', 6, NOW() - INTERVAL '28 days', NOW() - INTERVAL '30 days'),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 'f1f14fdc-87e3-4e9a-a773-0dfa0b43d842', 9, NOW() - INTERVAL '25 days', NOW() - INTERVAL '30 days'),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '7b4df42a-8539-41bc-9ae8-0651a3f091da', 12, NOW() - INTERVAL '22 days', NOW() - INTERVAL '30 days'),
    (uuid_generate_v4(), 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', '1fb28af0-e0a4-4dd7-80b4-ccccf4457654', 15, NOW() - INTERVAL '10 days', NOW() - INTERVAL '30 days')
ON CONFLICT (player_id, achievement_id) DO NOTHING;

-- Verificar datos insertados
SELECT COUNT(*) as total_achievements FROM achievements;
SELECT code, required_value, event_type, is_temporal, reward_points FROM achievements ORDER BY required_value;

SELECT COUNT(*) as total_player_achievements FROM player_achievements;
SELECT pa.player_id, COUNT(*) as achievements_count, SUM(CASE WHEN pa.unlocked_at IS NOT NULL THEN 1 ELSE 0 END) as unlocked_count
FROM player_achievements pa
GROUP BY pa.player_id
ORDER BY unlocked_count DESC;
