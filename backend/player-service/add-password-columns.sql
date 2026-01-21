-- Migración: Agregar campos de autenticación a la tabla players
-- Fecha: 2025

-- Agregar columna password
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Agregar columna must_change_password con valor por defecto
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT TRUE;

-- Actualizar jugadores existentes con contraseña temporal (solo para desarrollo/testing)
-- IMPORTANTE: En producción, estos usuarios deberían recibir un correo para restablecer contraseña
UPDATE players 
SET 
  password = '$2b$10$8ZqLQxN9xYGZ9vJ5L3kX0.yGZhH3X5P1xKv5Z5mH6mF8T8X5Z5Z5Z', -- Hash de "TEMP1234"
  must_change_password = TRUE
WHERE password IS NULL;

-- Hacer NOT NULL después de actualizar datos existentes
ALTER TABLE players 
ALTER COLUMN password SET NOT NULL;

-- Comentarios
COMMENT ON COLUMN players.password IS 'Contraseña hasheada con bcrypt (salt rounds: 10)';
COMMENT ON COLUMN players.must_change_password IS 'Indica si el usuario debe cambiar su contraseña en el próximo login';
