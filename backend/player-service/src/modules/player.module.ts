import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Player } from '../entities/player.entity';
import { PremiumPurchase } from '../entities/premium-purchase.entity';
import { PlayerController } from '../controllers/player.controller';
import { PaymentController } from '../controllers/payment.controller';
import { PlayerService } from '../services/player.service';
import { PaymentService } from '../services/payment.service';
import { PlayerRepository } from '../repositories/player.repository';
import { EventPublisher } from '../events/event.publisher';
import { EmailService } from '../services/email.service';

/**
 * Módulo de Jugador
 * Principios SOLID:
 * - S (Responsabilidad Única): El módulo maneja solo componentes relacionados con jugadores
 * - D (Inversión de Dependencias): Usa tokens de proveedor para abstracciones
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Player, PremiumPurchase]),
    ConfigModule,
  ],
  controllers: [PlayerController, PaymentController],
  providers: [
    PlayerService,
    PaymentService,
    EmailService,
    {
      provide: 'IPlayerRepository',
      useClass: PlayerRepository,
    },
    {
      provide: 'IEventPublisher',
      useFactory: (configService: ConfigService) => {
        const rabbitMqUrl = configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672');
        return new EventPublisher(rabbitMqUrl);
      },
      inject: [ConfigService],
    },
  ],
  exports: [PlayerService],
})
export class PlayerModule {}

