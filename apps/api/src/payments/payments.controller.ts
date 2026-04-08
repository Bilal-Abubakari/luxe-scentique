import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService, PaystackWebhookEvent } from './payments.service';
import { IServiceFeeCalculation } from '@luxe-scentique/shared-types';
import { PaystackInitializeDto } from '@luxe-scentique/shared-types/dtos';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('fee')
  @ApiOperation({ summary: 'Calculate service fee for a given subtotal' })
  @ApiQuery({ name: 'subtotal', type: Number, description: 'Order subtotal in GHS' })
  @ApiResponse({ status: 200, description: 'Returns fee breakdown' })
  calculateFee(@Query('subtotal') subtotal: string): IServiceFeeCalculation {
    return this.paymentsService.calculateServiceFee(Number.parseFloat(subtotal));
  }

  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initialize a Paystack transaction for an existing order' })
  @ApiResponse({ status: 200, description: 'Returns Paystack authorization URL and reference' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Order already paid' })
  initialize(@Body() dto: PaystackInitializeDto): Promise<{ authorization_url: string; access_code: string; reference: string }> {
    return this.paymentsService.initializeOrderPayment(dto.orderId);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a Paystack transaction by reference' })
  @ApiResponse({ status: 200, description: 'Transaction verified' })
  verify(@Body('reference') reference: string): Promise<unknown> {
    return this.paymentsService.verifyTransaction(reference);
  }

  /**
   * Paystack Webhook receiver.
   *
   * Configure this URL in your Paystack dashboard:
   *   https://yourdomain.com/api/v1/payments/webhook
   *
   * Paystack signs each request with HMAC-SHA512 of the raw body
   * using your secret key, sent in the `x-paystack-signature` header.
   * We verify the signature before processing.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paystack webhook receiver (configure in Paystack dashboard)' })
  @ApiHeader({
    name: 'x-paystack-signature',
    description: 'HMAC-SHA512 signature of the raw body using your Paystack secret key',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook received and processed' })
  @ApiResponse({ status: 401, description: 'Invalid webhook signature' })
  async handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    const rawBody = req.rawBody;

    if (!rawBody) {
      this.logger.error('Webhook received with no raw body — ensure rawBody: true in main.ts');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    if (!this.paymentsService.verifyWebhookSignature(signature, rawBody)) {
      this.logger.warn('Webhook signature verification failed');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody.toString()) as PaystackWebhookEvent;
    await this.paymentsService.handleWebhookEvent(event);

    return { received: true };
  }
}
