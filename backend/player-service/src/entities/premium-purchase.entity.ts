import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity('premium_purchases')
export class PremiumPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'player_id' })
  playerId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'stripe_payment_id', unique: true })
  stripePaymentId: string;

  @Column({ name: 'stripe_checkout_session_id', unique: true, nullable: true })
  stripeCheckoutSessionId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ length: 3, default: 'COP' })
  currency: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'completed' | 'failed' | 'refunded';

  @Column({ name: 'purchased_at', type: 'timestamp', nullable: true })
  purchasedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
