import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { PremiumPurchase } from '../entities/premium-purchase.entity';
import { Player } from '../entities/player.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;
  private readonly premiumPrice = 1000000; // 10,000 COP en centavos

  constructor(
    private configService: ConfigService,
    @InjectRepository(PremiumPurchase)
    private premiumPurchaseRepository: Repository<PremiumPurchase>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      this.logger.warn('⚠️  STRIPE_SECRET_KEY no configurada. Servicio de pagos en modo mock.');
    } else {
      this.stripe = new Stripe(stripeSecretKey);
      this.logger.log('✅ Stripe configurado correctamente');
    }
  }

  /**
   * Crea una sesión de checkout de Stripe para compra premium
   */
  async createCheckoutSession(playerId: string, successUrl: string, cancelUrl: string): Promise<{ sessionUrl: string; sessionId: string }> {
    if (!this.stripe) {
      throw new BadRequestException('Servicio de pagos no disponible');
    }

    // Verificar si el jugador ya es premium
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    if (!player) {
      throw new BadRequestException('Jugador no encontrado');
    }

    if (player.isPremium) {
      throw new BadRequestException('Ya tienes acceso premium');
    }

    try {
      // Crear sesión de Stripe Checkout
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'cop',
              product_data: {
                name: 'Gaming Achievements - Acceso Premium',
                description: 'Desbloquea todos los niveles (3+) y recompensas exclusivas',
                images: ['https://placeholder.com/gaming-premium.png'],
              },
              unit_amount: this.premiumPrice,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: playerId,
        metadata: {
          playerId: playerId,
          productType: 'premium_unlock',
        },
      });

      // Registrar la compra en estado pending
      const purchase = this.premiumPurchaseRepository.create({
        playerId: playerId,
        stripePaymentId: session.id,
        stripeCheckoutSessionId: session.id,
        amount: this.premiumPrice,
        currency: 'COP',
        status: 'pending',
      });

      await this.premiumPurchaseRepository.save(purchase);

      this.logger.log(`🛒 Checkout session creada para jugador ${playerId}: ${session.id}`);

      return {
        sessionUrl: session.url || '',
        sessionId: session.id,
      };
    } catch (error: any) {
      this.logger.error(`❌ Error creando checkout session: ${error.message}`, error.stack);
      throw new BadRequestException(`Error al crear sesión de pago: ${error.message}`);
    }
  }

  /**
   * Verifica el estado premium de un jugador
   */
  async checkPremiumStatus(playerId: string): Promise<{ isPremium: boolean; purchasedAt?: Date }> {
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    
    if (!player) {
      throw new BadRequestException('Jugador no encontrado');
    }

    return {
      isPremium: player.isPremium,
      purchasedAt: player.premiumPurchasedAt,
    };
  }

  /**
   * Webhook handler para eventos de Stripe
   */
  async handleStripeWebhook(signature: string, rawBody: Buffer): Promise<void> {
    if (!this.stripe) {
      throw new BadRequestException('Servicio de pagos no disponible');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      this.logger.warn('⚠️  STRIPE_WEBHOOK_SECRET no configurado');
      return;
    }

    try {
      const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

      this.logger.log(`📨 Webhook recibido: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        default:
          this.logger.log(`Evento no manejado: ${event.type}`);
      }
    } catch (error: any) {
      this.logger.error(`❌ Error procesando webhook: ${error.message}`, error.stack);
      throw new BadRequestException(`Error en webhook: ${error.message}`);
    }
  }

  /**
   * Maneja el evento de checkout completado
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const playerId = session.metadata?.playerId || session.client_reference_id;

    if (!playerId) {
      this.logger.error('❌ No se encontró playerId en el checkout session');
      return;
    }

    try {
      // Actualizar el estado de la compra
      const purchase = await this.premiumPurchaseRepository.findOne({
        where: { stripeCheckoutSessionId: session.id },
      });

      if (purchase) {
        purchase.status = 'completed';
        purchase.purchasedAt = new Date();
        purchase.stripePaymentId = session.payment_intent as string;
        await this.premiumPurchaseRepository.save(purchase);
      }

      // Activar premium para el jugador
      await this.playerRepository.update(
        { id: playerId },
        { 
          isPremium: true, 
          premiumPurchasedAt: new Date() 
        }
      );

      this.logger.log(`✅ Jugador ${playerId} ahora tiene acceso premium`);
    } catch (error: any) {
      this.logger.error(`❌ Error activando premium para jugador ${playerId}: ${error.message}`, error.stack);
    }
  }

  /**
   * Maneja el evento de pago exitoso
   */
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    this.logger.log(`💳 Pago exitoso: ${paymentIntent.id} - ${paymentIntent.amount} ${paymentIntent.currency}`);
    
    // Actualizar estado si existe
    const purchase = await this.premiumPurchaseRepository.findOne({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (purchase && purchase.status === 'pending') {
      purchase.status = 'completed';
      purchase.purchasedAt = new Date();
      await this.premiumPurchaseRepository.save(purchase);
    }
  }

  /**
   * Maneja el evento de pago fallido
   */
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    this.logger.error(`❌ Pago fallido: ${paymentIntent.id}`);
    
    const purchase = await this.premiumPurchaseRepository.findOne({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (purchase) {
      purchase.status = 'failed';
      await this.premiumPurchaseRepository.save(purchase);
    }
  }

  /**
   * Obtiene el historial de compras de un jugador
   */
  async getPurchaseHistory(playerId: string): Promise<PremiumPurchase[]> {
    return this.premiumPurchaseRepository.find({
      where: { playerId },
      order: { createdAt: 'DESC' },
    });
  }
}
