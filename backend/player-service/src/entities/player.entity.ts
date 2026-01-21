import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad de Jugador - Representa un jugador en el sistema de juego
 * Principio SOLID S (Responsabilidad Única): Solo maneja la estructura de datos del jugador
 */
@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ name: 'must_change_password', default: true })
  mustChangePassword: boolean;

  @Column({ type: 'int', default: 0 })
  monstersKilled: number;

  @Column({ type: 'int', default: 0 })
  timePlayed: number; // en minutos

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'is_premium', default: false })
  isPremium: boolean;

  @Column({ name: 'premium_purchased_at', type: 'timestamp', nullable: true })
  premiumPurchasedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

