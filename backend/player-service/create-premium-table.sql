-- Crear tabla para gestionar compras premium
CREATE TABLE IF NOT EXISTS premium_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    stripe_payment_id VARCHAR(255) NOT NULL UNIQUE,
    stripe_checkout_session_id VARCHAR(255) UNIQUE,
    amount INTEGER NOT NULL, -- Monto en centavos
    currency VARCHAR(3) NOT NULL DEFAULT 'COP',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_premium_purchases_player_id ON premium_purchases(player_id);
CREATE INDEX IF NOT EXISTS idx_premium_purchases_stripe_payment_id ON premium_purchases(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_premium_purchases_status ON premium_purchases(status);

-- Añadir campo isPremium a la tabla players
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_purchased_at TIMESTAMP NULL;

-- Índice para búsqueda rápida de usuarios premium
CREATE INDEX IF NOT EXISTS idx_players_is_premium ON players(is_premium);

-- Comentarios para documentación
COMMENT ON TABLE premium_purchases IS 'Registro de compras premium (pago único) de jugadores';
COMMENT ON COLUMN premium_purchases.amount IS 'Monto pagado en centavos (ej: 10000 COP = 1000000 centavos)';
COMMENT ON COLUMN premium_purchases.status IS 'Estado del pago: pending, completed, failed, refunded';
COMMENT ON COLUMN players.is_premium IS 'Indica si el jugador tiene acceso premium (niveles 3+)';
COMMENT ON COLUMN players.premium_purchased_at IS 'Fecha y hora de compra del acceso premium';
