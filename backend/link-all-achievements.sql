-- Vincular todos los logros al jugador actual
\c achievement_db

-- Insertar PlayerAchievements para todos los logros que no estén vinculados
INSERT INTO player_achievements (id, player_id, achievement_id, progress, unlocked_at, created_at)
SELECT 
  gen_random_uuid(),
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'::uuid,
  a.id,
  0,
  NULL,
  NOW()
FROM achievements a
WHERE NOT EXISTS (
  SELECT 1 FROM player_achievements pa 
  WHERE pa.achievement_id = a.id 
  AND pa.player_id = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'::uuid
);

-- Verificar total de PlayerAchievements
SELECT COUNT(*) as total_player_achievements FROM player_achievements WHERE player_id = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'::uuid;

-- Mostrar logros del Nivel 2
SELECT 
  a.code,
  a.event_type,
  a.required_value,
  pa.progress,
  CASE WHEN pa.unlocked_at IS NOT NULL THEN 'Si' ELSE 'No' END as desbloqueado
FROM player_achievements pa
JOIN achievements a ON pa.achievement_id = a.id
WHERE pa.player_id = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'::uuid
AND a.event_type LIKE 'LEVEL_2%'
ORDER BY a.required_value;
