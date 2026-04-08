import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOrder, OrderStatus } from '@luxe-scentique/shared-types';
import { EMAIL_PROVIDER, IEmailProvider } from './interfaces/email-provider.interface';
import { orderConfirmationTemplate } from './templates/order-confirmation.template';
import { paymentConfirmedTemplate } from './templates/payment-confirmed.template';
import { orderStatusUpdateTemplate } from './templates/order-status-update.template';
import { orderCancelledTemplate } from './templates/order-cancelled.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly frontendUrl: string;

  constructor(
    @Inject(EMAIL_PROVIDER) private readonly provider: IEmailProvider,
    private readonly config: ConfigService,
  ) {
    this.frontendUrl = config.get<string>('frontendUrl') ?? 'http://localhost:3000';
  }

  /**
   * Sent immediately when a new order is created.
   * Lets the customer know their order was received and shows a summary.
   */
  async sendOrderConfirmation(order: IOrder): Promise<void> {
    if (!order.customerEmail) return;
    await this.safeSend(
      `sendOrderConfirmation [${order.orderNumber}]`,
      () =>
        this.provider.send({
          to: order.customerEmail,
          subject: `Order Confirmed — ${order.orderNumber} | Luxe Scentique`,
          html: orderConfirmationTemplate({
            order,
            trackOrderUrl: this.orderTrackUrl(order.orderNumber),
          }),
        }),
    );
  }

  /**
   * Sent after a successful Paystack payment (webhook or manual verify).
   * Shows the payment reference and updated order status.
   */
  async sendPaymentConfirmation(order: IOrder): Promise<void> {
    if (!order.customerEmail) return;
    await this.safeSend(
      `sendPaymentConfirmation [${order.orderNumber}]`,
      () =>
        this.provider.send({
          to: order.customerEmail,
          subject: `Payment Received — ${order.orderNumber} | Luxe Scentique`,
          html: paymentConfirmedTemplate({
            order,
            trackOrderUrl: this.orderTrackUrl(order.orderNumber),
          }),
        }),
    );
  }

  /**
   * Sent when an admin updates an order status (PROCESSING → SHIPPED → DELIVERED).
   * Automatically routes to the cancellation email if status is CANCELLED.
   */
  async sendOrderStatusUpdate(order: IOrder): Promise<void> {
    if (!order.customerEmail) return;

    // Cancellations get their own dedicated email
    if (order.status === OrderStatus.CANCELLED) {
      return this.sendOrderCancelled(order);
    }

    const subjectMap: Partial<Record<OrderStatus, string>> = {
      [OrderStatus.PROCESSING]: `Your Order is Being Processed — ${order.orderNumber}`,
      [OrderStatus.SHIPPED]:    `Your Order Has Shipped — ${order.orderNumber} | Luxe Scentique`,
      [OrderStatus.DELIVERED]:  `Your Order Has Been Delivered — ${order.orderNumber}`,
    };

    const subject =
      subjectMap[order.status] ??
      `Order Update — ${order.orderNumber} | Luxe Scentique`;

    await this.safeSend(
      `sendOrderStatusUpdate [${order.orderNumber}] → ${order.status}`,
      () =>
        this.provider.send({
          to: order.customerEmail,
          subject,
          html: orderStatusUpdateTemplate({
            order,
            trackOrderUrl: this.orderTrackUrl(order.orderNumber),
          }),
        }),
    );
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async sendOrderCancelled(order: IOrder): Promise<void> {
    await this.safeSend(
      `sendOrderCancelled [${order.orderNumber}]`,
      () =>
        this.provider.send({
          to: order.customerEmail,
          subject: `Order Cancelled — ${order.orderNumber} | Luxe Scentique`,
          html: orderCancelledTemplate({ order }),
        }),
    );
  }

  /** Wraps a send call so email failures never bubble up to the caller. */
  private async safeSend(context: string, fn: () => Promise<void>): Promise<void> {
    try {
      await fn();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Email error — ${context}: ${message}`);
      // Intentionally swallowed: email failures must not disrupt core flows
    }
  }

  private orderTrackUrl(orderNumber: string): string {
    return `${this.frontendUrl}/orders?ref=${encodeURIComponent(orderNumber)}`;
  }
}
