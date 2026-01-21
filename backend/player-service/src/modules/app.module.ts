import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlayerModule } from './player.module';
import { Player } from '../entities/player.entity';
import { PremiumPurchase } from '../entities/premium-purchase.entity';

/**
 * Módulo de Aplicación - Módulo Raíz
 * Principio SOLID S: Coordina todos los módulos de la aplicación
 */
@Module({
  imports: [
    // Configuración del entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configuración de la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5433),
        username: configService.get<string>('DB_USER', 'player_user'),
        password: configService.get<string>('DB_PASSWORD', 'player_pass'),
        database: configService.get<string>('DB_NAME', 'player_db'),
        entities: [Player, PremiumPurchase],
        synchronize: configService.get<boolean>('DB_SYNC', true), // Solo para desarrollo
        logging: configService.get<boolean>('DB_LOGGING', false),
      }),
      inject: [ConfigService],
    }),
    
    // Módulos de características
    PlayerModule,
  ],
})
export class AppModule {}
