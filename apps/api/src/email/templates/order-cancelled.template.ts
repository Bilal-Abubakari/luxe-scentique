import { IOrder } from '@luxe-scentique/shared-types';
import {
  baseTemplate,
  escapeHtml,
  formatCurrency,
  formatDate,
  sectionHeading,
} from './base.template';

export interface OrderCancelledContext {
  order: IOrder;
}

export function orderCancelledTemplate({ order }: OrderCancelledContext): string {
  const name = order.customerName ?? 'Valued Customer';
  const supportEmail = 'hello@luxescentique.com';

  const content = `
  <!-- ── HERO ── -->
  <tr>
    <td class="email-pad" style="padding:48px 48px 36px;text-align:center;border-bottom:1px solid #F0EBE1;">
      <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background-color:#FEE2E2;line-height:64px;font-size:28px;text-align:center;margin-bottom:20px;">✕</div>
      <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;color:#1E1E1E;letter-spacing:1px;">Order Cancelled</p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:#666666;line-height:1.7;">
        We're sorry to see you go, <strong style="color:#1E1E1E;">${escapeHtml(name)}</strong>. Your order <strong style="color:#333;">${escapeHtml(order.orderNumber)}</strong> has been cancelled.
      </p>
    </td>
  </tr>

  <!-- ── ORDER DETAILS ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Cancelled Order')}
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E8E0D0;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Order Number</td>
                      <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:700;color:#666666;letter-spacing:1px;text-decoration:line-through;">${escapeHtml(order.orderNumber)}</td>
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
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Status</td>
                      <td align="right">
                        <span style="display:inline-block;padding:4px 14px;border-radius:20px;background-color:#FEE2E2;color:#991B1B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Cancelled</span>
                      </td>
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

  <!-- ── ITEMS ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Items')}
        ${order.items.map((item, idx) => `
        <tr>
          <td style="${idx > 0 ? 'border-top:1px solid #F0EBE1;' : ''}padding:${idx > 0 ? '12px' : '0'} 0 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#888888;text-decoration:line-through;">${escapeHtml(item.productTitle)} × ${item.quantity}</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#AAAAAA;text-decoration:line-through;white-space:nowrap;">${formatCurrency(item.subtotal)}</td>
              </tr>
            </table>
          </td>
        </tr>`).join('')}
        <tr>
          <td style="border-top:2px solid #E8E0D0;padding-top:14px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#AAAAAA;text-decoration:line-through;">Total</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#AAAAAA;text-decoration:line-through;white-space:nowrap;">${formatCurrency(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── REFUND NOTE ── -->
  ${order.isPaid ? `
  <tr>
    <td class="email-pad" style="padding:24px 48px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-left:3px solid #C9A84C;padding-left:16px;">
        <tr>
          <td>
            <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:#1E1E1E;text-transform:uppercase;letter-spacing:0.5px;">Refund Information</p>
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#666666;line-height:1.7;">Since you've already paid for this order, a refund of <strong>${formatCurrency(order.total)}</strong> will be processed. Please allow 5–10 business days for the refund to appear on your original payment method. Contact us if you have any questions.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ''}

  <!-- ── COME BACK ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;text-align:center;border-bottom:1px solid #F0EBE1;">
      <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:16px;color:#1E1E1E;">We hope to welcome you back</p>
      <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#888888;line-height:1.7;">If there's anything we can do to improve your experience or if you have questions about this cancellation, please don't hesitate to reach out.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="border-radius:4px;border:2px solid #C9A84C;">
            <a href="mailto:${supportEmail}" style="display:inline-block;padding:12px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:600;color:#C9A84C;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">Contact Support</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  return baseTemplate({
    preheader: `Your Luxe Scentique order ${order.orderNumber} has been cancelled.${order.isPaid ? ' A refund will be processed to your original payment method.' : ''}`,
    content,
    supportEmail,
  });
}
