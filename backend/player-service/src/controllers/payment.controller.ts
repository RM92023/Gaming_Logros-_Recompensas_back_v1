import { Controller, Post, Get, Body, Param, Headers, RawBodyRequest, Req, HttpCode, HttpStatus, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /payments/create-checkout
   * Crea una sesión de checkout de Stripe para compra premium
   */
  @Post('create-checkout')
  async createCheckout(
    @Body() body: { playerId: string; successUrl: string; cancelUrl: string },
  ) {
    const { playerId, successUrl, cancelUrl } = body;

    if (!playerId || !successUrl || !cancelUrl) {
      throw new BadRequestException('playerId, successUrl y cancelUrl son requeridos');
    }

    const result = await this.paymentService.createCheckoutSession(
      playerId,
      successUrl,
      cancelUrl,
    );

    return {
      success: true,
      message: 'Sesión de checkout creada exitosamente',
      data: result,
    };
  }

  /**
   * GET /payments/premium-status/:playerId
   * Verifica si un jugador tiene acceso premium
   */
  @Get('premium-status/:playerId')
  async checkPremiumStatus(@Param('playerId') playerId: string) {
    const status = await this.paymentService.checkPremiumStatus(playerId);

    return {
      success: true,
      data: status,
    };
  }

  /**
   * GET /payments/purchase-history/:playerId
   * Obtiene el historial de compras de un jugador
   */
  @Get('purchase-history/:playerId')
  async getPurchaseHistory(@Param('playerId') playerId: string) {
    const history = await this.paymentService.getPurchaseHistory(playerId);

    return {
      success: true,
      data: history,
    };
  }

  /**
   * POST /payments/webhook
   * Webhook para recibir eventos de Stripe
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<any>,
  ) {
    if (!signature) {
      throw new BadRequestException('No stripe-signature header');
    }

    if (!req.rawBody) {
      throw new BadRequestException('No raw body');
    }

    await this.paymentService.handleStripeWebhook(signature, req.rawBody);

    return { received: true };
  }
}
