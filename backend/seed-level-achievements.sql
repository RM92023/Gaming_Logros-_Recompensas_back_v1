-- Logros específicos por nivel del juego Monster Hunt
-- Conectar a la base de datos
\c achievement_db

-- Logros de Nivel 1 (15 monstruos - Slimes)
INSERT INTO achievements (id, code, title_key, description_key, required_value, event_type, is_temporal, temporal_window_start, temporal_window_end, is_active, reward_points, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'LEVEL_1_COMPLETE', 'Maestro de Slimes', 'Completa el Nivel 1 derrotando 15 Slimes', 15, 'LEVEL_1_COMPLETE', FALSE, NULL, NULL, TRUE, 100, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_1_HALF', 'Cazador de Slimes', 'Derrota 8 Slimes en el Nivel 1', 8, 'LEVEL_1_PROGRESS', FALSE, NULL, NULL, TRUE, 50, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Logros de Nivel 2 (15 monstruos - Goblins)
INSERT INTO achievements (id, code, title_key, description_key, required_value, event_type, is_temporal, temporal_window_start, temporal_window_end, is_active, reward_points, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'LEVEL_2_COMPLETE', 'Exterminador de Goblins', 'Completa el Nivel 2 derrotando 15 Goblins', 15, 'LEVEL_2_COMPLETE', FALSE, NULL, NULL, TRUE, 150, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_2_HALF', 'Cazador de Goblins', 'Derrota 8 Goblins en el Nivel 2', 8, 'LEVEL_2_PROGRESS', FALSE, NULL, NULL, TRUE, 75, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_2_START', 'Primera Sangre Goblin', 'Derrota tu primer Goblin en el Nivel 2', 1, 'LEVEL_2_PROGRESS', FALSE, NULL, NULL, TRUE, 25, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Logros de Nivel 3 (15 monstruos - Orcos)
INSERT INTO achievements (id, code, title_key, description_key, required_value, event_type, is_temporal, temporal_window_start, temporal_window_end, is_active, reward_points, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'LEVEL_3_COMPLETE', 'Vencedor de Orcos', 'Completa el Nivel 3 derrotando 15 Orcos', 15, 'LEVEL_3_COMPLETE', FALSE, NULL, NULL, TRUE, 200, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_3_HALF', 'Cazador de Orcos', 'Derrota 8 Orcos en el Nivel 3', 8, 'LEVEL_3_PROGRESS', FALSE, NULL, NULL, TRUE, 100, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_3_START', 'Primer Orco Caído', 'Derrota tu primer Orco en el Nivel 3', 1, 'LEVEL_3_PROGRESS', FALSE, NULL, NULL, TRUE, 50, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Logros de Nivel 4 (15 monstruos - Demonios)
INSERT INTO achievements (id, code, title_key, description_key, required_value, event_type, is_temporal, temporal_window_start, temporal_window_end, is_active, reward_points, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'LEVEL_4_COMPLETE', 'Cazador de Demonios', 'Completa el Nivel 4 derrotando 15 Demonios', 15, 'LEVEL_4_COMPLETE', FALSE, NULL, NULL, TRUE, 250, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_4_HALF', 'Exterminador de Demonios', 'Derrota 8 Demonios en el Nivel 4', 8, 'LEVEL_4_PROGRESS', FALSE, NULL, NULL, TRUE, 125, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_4_START', 'Primer Demonio Vencido', 'Derrota tu primer Demonio en el Nivel 4', 1, 'LEVEL_4_PROGRESS', FALSE, NULL, NULL, TRUE, 75, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Logros de Nivel 5 (15 monstruos - Dragones)
INSERT INTO achievements (id, code, title_key, description_key, required_value, event_type, is_temporal, temporal_window_start, temporal_window_end, is_active, reward_points, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'LEVEL_5_COMPLETE', 'Matador de Dragones', 'Completa el Nivel 5 derrotando 15 Dragones', 15, 'LEVEL_5_COMPLETE', FALSE, NULL, NULL, TRUE, 500, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_5_HALF', 'Cazador de Dragones', 'Derrota 8 Dragones en el Nivel 5', 8, 'LEVEL_5_PROGRESS', FALSE, NULL, NULL, TRUE, 250, NOW(), NOW()),
  (gen_random_uuid(), 'LEVEL_5_START', 'Primera Escama de Dragón', 'Derrota tu primer Dragón en el Nivel 5', 1, 'LEVEL_5_PROGRESS', FALSE, NULL, NULL, TRUE, 100, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Logro de Gran Maestro (completar todos los niveles)
INSERT INTO achievements (id, code, title_key, description_key, required_value, event_type, is_temporal, temporal_window_start, temporal_window_end, is_active, reward_points, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'GRAND_MASTER', 'Gran Maestro Cazador', 'Completa todos los 5 niveles del juego', 5, 'LEVELS_COMPLETED', FALSE, NULL, NULL, TRUE, 1000, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Verificar los logros insertados
SELECT code, title_key, required_value, event_type, reward_points 
FROM achievements 
WHERE event_type LIKE 'LEVEL_%' OR event_type = 'LEVELS_COMPLETED'
ORDER BY event_type, required_value;
