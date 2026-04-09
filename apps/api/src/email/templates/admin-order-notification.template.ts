// ---------------------------------------------------------------------------
// Luxe Scentique — Admin: New Order Notification
// Sent to the admin inbox whenever a new order is placed.
// Operational tone; includes all details the admin needs at a glance plus
// a direct link into the dashboard.
// ---------------------------------------------------------------------------

import { IOrder } from '@luxe-scentique/shared-types';
import {
  baseTemplate,
  ctaButton,
  escapeHtml,
  formatCurrency,
  formatDate,
  sectionHeading,
  statusBadge,
} from './base.template';

export interface AdminOrderNotificationContext {
  order: IOrder;
  /** Deep-link directly to this order in the admin dashboard. */
  adminOrderUrl: string;
}

export function adminOrderNotificationTemplate({
  order,
  adminOrderUrl,
}: AdminOrderNotificationContext): string {
  const customerName = order.customerName ?? 'Guest Customer';
  const paymentLabel =
    order.paymentMethod === 'WALK_IN' ? 'Walk-In Sale' : 'Online Payment';
  const isPaidLabel = order.isPaid
    ? '<span style="display:inline-block;padding:3px 12px;border-radius:20px;background-color:#D1FAE5;color:#065F46;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Paid</span>'
    : '<span style="display:inline-block;padding:3px 12px;border-radius:20px;background-color:#FEF3C7;color:#92400E;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Awaiting Payment</span>';

  const content = `
  <!-- ── ADMIN BADGE + HERO ── -->
  <tr>
    <td class="email-pad" style="padding:40px 48px 32px;text-align:center;border-bottom:1px solid #F0EBE1;">
      <!-- "Admin Notification" pill -->
      <div style="display:inline-block;margin-bottom:20px;padding:5px 18px;border-radius:20px;background-color:#1E1E1E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:10px;font-weight:700;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;">Admin Notification</div>
      <!-- Bell icon -->
      <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background-color:#1E1E1E;line-height:64px;font-size:26px;text-align:center;margin:0 auto 20px;display:block;">🛒</div>
      <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;color:#1E1E1E;letter-spacing:1px;">New Order Received</p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#666666;line-height:1.7;">A new order has been placed on Luxe Scentique and is awaiting your review.</p>
    </td>
  </tr>

  <!-- ── ORDER SNAPSHOT BANNER ── -->
  <tr>
    <td style="padding:0;background-color:#111111;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <!-- Order number -->
          <td style="padding:20px 24px;border-right:1px solid #2A2A2A;text-align:center;width:34%;">
            <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:10px;color:#888888;letter-spacing:1.5px;text-transform:uppercase;">Order</p>
            <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:700;color:#C9A84C;letter-spacing:1px;">${escapeHtml(order.orderNumber)}</p>
          </td>
          <!-- Total -->
          <td style="padding:20px 24px;border-right:1px solid #2A2A2A;text-align:center;width:33%;">
            <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:10px;color:#888888;letter-spacing:1.5px;text-transform:uppercase;">Order Value</p>
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:700;color:#C9A84C;">${formatCurrency(order.total)}</p>
          </td>
          <!-- Payment status -->
          <td style="padding:20px 24px;text-align:center;width:33%;">
            <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:10px;color:#888888;letter-spacing:1.5px;text-transform:uppercase;">Payment</p>
            ${isPaidLabel}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── CUSTOMER INFORMATION ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Customer Information')}
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E8E0D0;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;width:40%;">Name</td>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#1E1E1E;font-weight:500;">${escapeHtml(customerName)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;width:40%;">Email</td>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#1E1E1E;">
                        <a href="mailto:${escapeHtml(order.customerEmail)}" style="color:#C9A84C;text-decoration:none;">${escapeHtml(order.customerEmail)}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${order.customerPhone ? `
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;width:40%;">Phone</td>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#1E1E1E;">${escapeHtml(order.customerPhone)}</td>
                    </tr>
                  </table>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #F0EBE1;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;width:40%;">Date Placed</td>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#1E1E1E;">${formatDate(order.createdAt)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;width:40%;">Payment Method</td>
                      <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#1E1E1E;">${paymentLabel}</td>
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

  <!-- ── ORDER STATUS ── -->
  <tr>
    <td class="email-pad" style="padding:24px 48px;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#999999;letter-spacing:0.5px;text-transform:uppercase;vertical-align:middle;">Order Status</td>
          <td style="text-align:right;vertical-align:middle;">${statusBadge(order.status)}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── ITEMS ORDERED ── -->
  <tr>
    <td class="email-pad" style="padding:32px 48px;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${sectionHeading('Items Ordered')}
        <!-- Column headers -->
        <tr>
          <td style="padding-bottom:10px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:600;color:#999999;letter-spacing:0.5px;text-transform:uppercase;">Product</td>
                <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:600;color:#999999;letter-spacing:0.5px;text-transform:uppercase;width:60px;">Qty</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:600;color:#999999;letter-spacing:0.5px;text-transform:uppercase;width:100px;">Amount</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E8E0D0;border-radius:8px;overflow:hidden;">
              ${order.items.map((item, idx) => `
              <tr>
                <td style="padding:14px 20px;${idx < order.items.length - 1 ? 'border-bottom:1px solid #F0EBE1;' : ''}vertical-align:middle;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="vertical-align:middle;">
                        ${item.productImage ? `<img src="${escapeHtml(item.productImage)}" alt="${escapeHtml(item.productTitle)}" width="40" height="40" style="border-radius:4px;display:inline-block;vertical-align:middle;object-fit:cover;border:1px solid #E8E0D0;margin-right:12px;">` : ''}
                        <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#1E1E1E;vertical-align:middle;">${escapeHtml(item.productTitle)}</span>
                      </td>
                      <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#666666;width:60px;white-space:nowrap;">× ${item.quantity}</td>
                      <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#333333;width:100px;white-space:nowrap;">${formatCurrency(item.subtotal)}</td>
                    </tr>
                  </table>
                </td>
              </tr>`).join('')}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── ORDER TOTALS ── -->
  <tr>
    <td class="email-pad" style="padding:0 48px 32px;background-color:#FDFBF7;border-bottom:1px solid #F0EBE1;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E8E0D0;border-radius:8px;overflow:hidden;margin-top:32px;max-width:320px;margin-left:auto;">
        <tr>
          <td style="padding:12px 20px;border-bottom:1px solid #F0EBE1;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#666666;">Subtotal</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#333333;">${formatCurrency(order.subtotal)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px;border-bottom:1px solid #F0EBE1;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#666666;">Service Fee</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#333333;">${formatCurrency(order.serviceFee)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 20px;background-color:#1E1E1E;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#C9A84C;text-transform:uppercase;letter-spacing:0.5px;">Total</td>
                <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:700;color:#C9A84C;">${formatCurrency(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${order.notes ? `
  <!-- ── CUSTOMER NOTES ── -->
  <tr>
    <td class="email-pad" style="padding:24px 48px;border-bottom:1px solid #F0EBE1;background-color:#FFFDF9;">
      <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:600;color:#999999;letter-spacing:1px;text-transform:uppercase;">Customer Notes</p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#444444;line-height:1.7;font-style:italic;">&ldquo;${escapeHtml(order.notes)}&rdquo;</p>
    </td>
  </tr>` : ''}

  <!-- ── CTA ── -->
  <tr>
    <td class="email-pad" style="padding:36px 48px;text-align:center;">
      <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#666666;line-height:1.7;">View the full order in your admin dashboard to update its status and manage fulfilment.</p>
      ${ctaButton('View Order in Dashboard', adminOrderUrl)}
      <p style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#AAAAAA;">Order reference: <strong style="color:#555555;">${escapeHtml(order.orderNumber)}</strong></p>
    </td>
  </tr>`;

  return baseTemplate({
    preheader: `New order ${order.orderNumber} — ${formatCurrency(order.total)} from ${customerName}. Review it in your dashboard.`,
    content,
    supportEmail: 'hello@luxescentique.com',
  });
}
