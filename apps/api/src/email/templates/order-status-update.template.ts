import { IOrder, OrderStatus } from '@luxe-scentique/shared-types';
import {
  baseTemplate,
  ctaButton,
  escapeHtml,
  formatCurrency,
  formatDate,
  sectionHeading,
  statusBadge,
} from './base.template';

export interface OrderStatusUpdateContext {
  order: IOrder;
  trackOrderUrl: string;
}

interface StatusConfig {
  emoji: string;
  headline: string;
  message: string;
  preheader: string;
}

function getStatusConfig(status: OrderStatus, orderNumber: string, name: string): StatusConfig {
  const configs: Partial<Record<OrderStatus, StatusConfig>> = {
    [OrderStatus.PROCESSING]: {
      emoji: '⚙️',
      headline: 'Order is Being Processed',
      message: `Hi <strong style="color:#1E1E1E;">${escapeHtml(name)}</strong>, your order <strong>${escapeHtml(orderNumber)}</strong> has been confirmed and our team is now preparing your fragrances with care.`,
      preheader: `Your order ${orderNumber} is being processed — we're getting your fragrances ready!`,
    },
    [OrderStatus.SHIPPED]: {
      emoji: '📦',
      headline: 'Your Order Has Shipped',
      message: `Great news, <strong style="color:#1E1E1E;">${escapeHtml(name)}</strong>! Order <strong>${escapeHtml(orderNumber)}</strong> is on its way to you. Your luxury fragrances are in transit and should arrive soon.`,
      preheader: `Your Luxe Scentique order ${orderNumber} has shipped and is on its way to you!`,
    },
    [OrderStatus.DELIVERED]: {
      emoji: '✨',
      headline: 'Order Delivered',
      message: `Welcome to a new sensory experience, <strong style="color:#1E1E1E;">${escapeHtml(name)}</strong>! Order <strong>${escapeHtml(orderNumber)}</strong> has been delivered. We hope you love your fragrances.`,
      preheader: `Your Luxe Scentique order ${orderNumber} has been delivered. Enjoy your fragrances!`,
    },
  };

  return configs[status] ?? {
    emoji: '📋',
    headline: `Order Status Updated`,
    message: `Hi <strong style="color:#1E1E1E;">${escapeHtml(name)}</strong>, your order <strong>${escapeHtml(orderNumber)}</strong> status has been updated.`,
    preheader: `Update on your Luxe Scentique order ${orderNumber}.`,
  };
}

export function orderStatusUpdateTemplate({ order, trackOrderUrl }: OrderStatusUpdateContext): string {
  const name = order.customerName ?? 'Valued Customer';
  const config = getStatusConfig(order.status, order.orderNumber, name);

  const content = `
  <!-- ── HERO ── -->
  <tr>
    <td class="email-pad" style="padding:48px 48px 36px;text-align:center;border-bottom:1px solid #F0EBE1;">
      <div style="font-size:48px;line-height:1;margin-bottom:20px;">${config.emoji}</div>
      <p style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;color:#1E1E1E;letter-spacing:0.5px;">${escapeHtml(config.headline)}</p>
      <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:#666666;line-height:1.7;">${config.message}</p>
      ${statusBadge(order.status)}
    </td>
  </tr>

  <!-- ── ORDER DETAILS ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Order Details')}
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E8E0D0;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Order Number</td>
                      <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:700;color:#C9A84C;letter-spacing:1px;">${escapeHtml(order.orderNumber)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Order Date</td>
                      <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#333333;">${formatDate(order.createdAt)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Order Total</td>
                      <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#C9A84C;">${formatCurrency(order.total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── ITEMS (compact) ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Items in This Order')}
        ${order.items.map((item, idx) => `
        <tr>
          <td style="${idx > 0 ? 'border-top:1px solid #F0EBE1;' : ''}padding:${idx > 0 ? '12px' : '0'} 0 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#333333;">${escapeHtml(item.productTitle)} <span style="color:#999;">× ${item.quantity}</span></td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#666666;white-space:nowrap;">${formatCurrency(item.subtotal)}</td>
              </tr>
            </table>
          </td>
        </tr>`).join('')}
      </table>
    </td>
  </tr>

  <!-- ── DELIVERED: Review nudge ── -->
  ${order.status === OrderStatus.DELIVERED ? `
  <tr>
    <td class="email-pad" style="padding:28px 48px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;text-align:center;">
      <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:15px;color:#1E1E1E;">Loving your fragrances?</p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#888888;line-height:1.7;">We'd love to hear your thoughts. Share your experience with us — your feedback helps us continue crafting exceptional scents.</p>
    </td>
  </tr>` : ''}

  <!-- ── CTA ── -->
  <tr>
    <td class="email-pad" style="padding:36px 48px;text-align:center;">
      ${ctaButton('Track Your Order', trackOrderUrl)}
    </td>
  </tr>`;

  return baseTemplate({
    preheader: config.preheader,
    content,
  });
}
