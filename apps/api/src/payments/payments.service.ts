import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { IServiceFeeCalculation } from '@luxe-scentique/shared-types';

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata?: Record<string, unknown>;
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata?: {
      orderId?: string;
      [key: string]: unknown;
    };
  };
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Calculate Paystack service fee (Ghana rates):
   * 1.95% of subtotal, capped at GHS 1000, minimum 50p
   */
  calculateServiceFee(subtotal: number): IServiceFeeCalculation {
    const rate = this.configService.get<number>('paystack.serviceFeeRate') ?? 0.0195;
    const cap = this.configService.get<number>('paystack.serviceFeeCap') ?? 1000;
    const min = this.configService.get<number>('paystack.serviceFeeMin') ?? 0.5;

    const rawFee = subtotal * rate;
    const serviceFee = Math.max(min, Math.min(rawFee, cap));

    return {
      subtotal,
      serviceFee: Math.round(serviceFee * 100) / 100,
      total: Math.round((subtotal + serviceFee) * 100) / 100,
    };
  }

  async initializeTransaction(params: {
    email: string;
    amount: number; // in GHS
    orderId: string;
    callbackUrl?: string;
  }): Promise<PaystackInitResponse['data']> {
    const secretKey = this.configService.get<string>('paystack.secretKey');
    const baseUrl = this.configService.get<string>('paystack.baseUrl');
    const frontendUrl = this.configService.get<string>('frontendUrl');

    const response = await axios.post<PaystackInitResponse>(
      `${baseUrl}/transaction/initialize`,
      {
        email: params.email,
        amount: Math.round(params.amount * 100), // Paystack expects pesewas
        currency: 'GHS',
        reference: `LSQ-${params.orderId}-${Date.now()}`,
        callback_url: params.callbackUrl ?? `${frontendUrl}/checkout/verify`,
        metadata: { orderId: params.orderId },
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.data.status) {
      this.logger.error(`Paystack init failed: ${response.data.message}`);
      throw new BadRequestException('Payment initialization failed');
    }

    return response.data.data;
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse['data']> {
    const secretKey = this.configService.get<string>('paystack.secretKey');
    const baseUrl = this.configService.get<string>('paystack.baseUrl');

    const response = await axios.get<PaystackVerifyResponse>(
      `${baseUrl}/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      },
    );

    if (!response.data.status) {
      throw new BadRequestException('Payment verification failed');
    }

    return response.data.data;
  }

  /**
   * Verify the HMAC-SHA512 signature Paystack sends with every webhook.
   * Paystack signs using your secret key over the raw request body.
   */
  verifyWebhookSignature(signature: string, rawBody: Buffer): boolean {
    const secretKey = this.configService.get<string>('paystack.secretKey') ?? '';
    const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
    return hash === signature;
  }

  /**
   * Process an incoming Paystack webhook event.
   * Currently handles: charge.success
   */
  async handleWebhookEvent(event: PaystackWebhookEvent): Promise<void> {
    this.logger.log(`Webhook received: ${event.event}`);

    if (event.event !== 'charge.success') return;

    const { reference, status, metadata } = event.data;

    if (status !== 'success') return;

    const orderId = metadata?.orderId;
    if (!orderId) {
      this.logger.warn(`charge.success missing orderId in metadata. ref=${reference}`);
      return;
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      this.logger.warn(`Webhook: order ${orderId} not found. ref=${reference}`);
      return;
    }

    if (order.isPaid) {
      this.logger.log(`Webhook: order ${orderId} already paid — skipping. ref=${reference}`);
      return;
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paymentRef: reference, status: 'PROCESSING' },
    });

    this.logger.log(`Webhook: order ${orderId} marked as paid. ref=${reference}`);
  }
}
