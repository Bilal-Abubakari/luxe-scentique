import { IOrder } from '@luxe-scentique/shared-types';
import {
  baseTemplate,
  ctaButton,
  escapeHtml,
  formatCurrency,
  formatDate,
  sectionHeading,
} from './base.template';

export interface OrderConfirmationContext {
  order: IOrder;
  trackOrderUrl: string;
}

export function orderConfirmationTemplate({ order, trackOrderUrl }: OrderConfirmationContext): string {
  const name = order.customerName ?? 'Valued Customer';

  const content = `
  <!-- ── HERO ── -->
  <tr>
    <td class="email-pad" style="padding:48px 48px 36px;text-align:center;border-bottom:1px solid #F0EBE1;">
      <!-- Icon -->
      <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background-color:#F4EFE6;line-height:64px;font-size:28px;text-align:center;margin-bottom:20px;">✓</div>
      <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;color:#1E1E1E;letter-spacing:1px;">Order Confirmed</p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:#666666;line-height:1.7;">Thank you, <strong style="color:#1E1E1E;">${escapeHtml(name)}</strong>! Your order has been received and is being prepared.</p>
    </td>
  </tr>

  <!-- ── ORDER META ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Order Details')}
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E8E0D0;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Order Number</td>
                      <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:700;color:#C9A84C;letter-spacing:1px;">${escapeHtml(order.orderNumber)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Date Placed</td>
                      <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#333333;">${formatDate(order.createdAt)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Payment</td>
                      <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#333333;">${order.paymentMethod === 'WALK_IN' ? 'Walk-In Sale' : 'Online Payment'}</td>
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

  <!-- ── ORDER ITEMS ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Your Fragrances')}
        <tr>
          <td>
            ${order.items.map((item, idx) => `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${idx > 0 ? 'border-top:1px solid #F0EBE1;' : ''}padding-top:${idx > 0 ? '16px' : '0'};margin-bottom:16px;">
              <tr>
                ${item.productImage ? `
                <td class="item-img" style="width:72px;vertical-align:top;padding-right:16px;">
                  <img src="${escapeHtml(item.productImage)}" alt="${escapeHtml(item.productTitle)}" width="72" height="72" style="border-radius:6px;display:block;object-fit:cover;border:1px solid #E8E0D0;">
                </td>` : ''}
                <td class="item-details" style="vertical-align:top;${item.productImage ? 'padding-left:0;' : ''}">
                  <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;color:#1E1E1E;">${escapeHtml(item.productTitle)}</p>
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#888888;">Qty: ${item.quantity} &nbsp;×&nbsp; ${formatCurrency(item.price)}</p>
                </td>
                <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;color:#333333;">${formatCurrency(item.subtotal)}</p>
                </td>
              </tr>
            </table>`).join('')}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── ORDER TOTALS ── -->
  <tr>
    <td class="email-pad" style="padding:0 48px 32px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E8E0D0;border-radius:8px;overflow:hidden;margin-top:32px;">
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#666666;">Subtotal</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#333333;">${formatCurrency(order.subtotal)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#666666;">Service Fee</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#333333;">${formatCurrency(order.serviceFee)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;background-color:#1E1E1E;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:700;color:#C9A84C;letter-spacing:0.5px;text-transform:uppercase;">Total</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:17px;font-weight:700;color:#C9A84C;">${formatCurrency(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── NEXT STEPS ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;border-bottom:1px solid #F0EBE1;">
      <p style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1E1E1E;">What happens next?</p>
      <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#666666;line-height:1.8;">
        ${order.paymentMethod === 'WALK_IN'
          ? '&bull;&nbsp; Your walk-in order is confirmed and is being processed immediately.'
          : '&bull;&nbsp; Complete your payment to confirm your order.<br>&bull;&nbsp; Once payment is received, we\'ll begin preparing your fragrances.<br>&bull;&nbsp; You\'ll receive a confirmation email as soon as payment is verified.'}
      </p>
    </td>
  </tr>

  <!-- ── CTA ── -->
  <tr>
    <td class="email-pad" style="padding:36px 48px;text-align:center;">
      ${ctaButton('Track Your Order', trackOrderUrl)}
      <p style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#AAAAAA;">Use order number <strong style="color:#333;">${escapeHtml(order.orderNumber)}</strong> to look up your order anytime.</p>
    </td>
  </tr>`;

  return baseTemplate({
    preheader: `Your Luxe Scentique order ${order.orderNumber} has been confirmed. Thank you for your purchase!`,
    content,
  });
}
