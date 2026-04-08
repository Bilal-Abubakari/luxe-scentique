// ---------------------------------------------------------------------------
// Luxe Scentique — Base Email Layout
// All brand emails extend this shell. Inline CSS is intentional: email
// clients strip <style> blocks, so every rule must live on the element.
// ---------------------------------------------------------------------------

export interface BaseTemplateContext {
  /** Short preview text shown in inbox list (before the email is opened). */
  preheader: string;
  /** The main body HTML that is slotted into the content area. */
  content: string;
  supportEmail?: string;
  year?: number;
}

// Brand tokens — single source of truth for this file
const BRAND = {
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  goldDim: '#8B6A20',
  onyx: '#111111',
  onyxSoft: '#1E1E1E',
  cream: '#F4EFE6',
  white: '#FFFFFF',
  grayDark: '#333333',
  grayMid: '#666666',
  grayLight: '#999999',
  graySubtle: '#AAAAAA',
};

export function baseTemplate({
  preheader,
  content,
  supportEmail = 'hello@luxescentique.com',
  year = new Date().getFullYear(),
}: BaseTemplateContext): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Luxe Scentique</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width:600px) {
      .email-container { width:100% !important; }
      .email-pad { padding-left:24px !important; padding-right:24px !important; }
      .item-img { display:none !important; width:0 !important; max-height:0 !important; overflow:hidden !important; }
      .item-details { padding-left:0 !important; }
      .two-col td { display:block !important; width:100% !important; }
      .hide-mobile { display:none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;word-break:break-word;">

  <!-- Preheader (invisible inbox preview text) -->
  <div style="display:none;font-size:1px;color:${BRAND.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.cream};">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">

        <!-- Email container -->
        <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${BRAND.white};border-radius:12px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,0.14);">

          <!-- ═══════════ HEADER ═══════════ -->
          <tr>
            <td style="background-color:${BRAND.onyx};padding:40px 48px 32px;text-align:center;">
              <!-- Wordmark -->
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${BRAND.gold};letter-spacing:7px;text-transform:uppercase;line-height:1.1;">LUXE SCENTIQUE</p>
              <p style="margin:8px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:10px;color:${BRAND.graySubtle};letter-spacing:4px;text-transform:uppercase;">FINE FRAGRANCES</p>
              <!-- Ornament rule -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 0;">
                <tr>
                  <td style="width:48px;height:1px;background-color:${BRAND.goldDim};"></td>
                  <td style="width:10px;"></td>
                  <td style="font-size:10px;color:${BRAND.gold};line-height:1;">◆</td>
                  <td style="width:10px;"></td>
                  <td style="width:48px;height:1px;background-color:${BRAND.goldDim};"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold accent bar -->
          <tr>
            <td style="height:4px;background-color:${BRAND.gold};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ═══════════ DYNAMIC CONTENT ═══════════ -->
          ${content}

          <!-- ═══════════ FOOTER ═══════════ -->
          <tr>
            <td style="background-color:${BRAND.onyx};padding:36px 48px;text-align:center;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:14px;color:${BRAND.gold};letter-spacing:3px;">✦ &nbsp; ✦ &nbsp; ✦</p>
              <p style="margin:16px 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#888888;line-height:1.7;">Questions or concerns? We'd love to hear from you.<br><a href="mailto:${supportEmail}" style="color:${BRAND.gold};text-decoration:none;">${supportEmail}</a></p>
              <p style="margin:20px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;color:#555555;line-height:1.7;">© ${year} Luxe Scentique. All rights reserved.<br>Crafted with care for fragrance enthusiasts.</p>
            </td>
          </tr>

        </table>
        <!-- End email container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Shared helpers — used by all template files
// ---------------------------------------------------------------------------

export function escapeHtml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatCurrency(amount: number): string {
  return `GHS&nbsp;${amount.toFixed(2)}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Render a primary CTA button. */
export function ctaButton(label: string, url: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td style="border-radius:4px;background-color:#C9A84C;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#111111;text-decoration:none;letter-spacing:1px;text-transform:uppercase;border-radius:4px;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

/** Section header with a subtle gold underline. */
export function sectionHeading(title: string): string {
  return `
<tr>
  <td style="padding:0 0 16px;">
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:400;color:#1E1E1E;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(title)}</p>
    <div style="width:32px;height:2px;background-color:#C9A84C;"></div>
  </td>
</tr>`;
}

/** Status badge with brand-aligned colours. */
export function statusBadge(status: string): string {
  const colours: Record<string, { bg: string; text: string }> = {
    PENDING:    { bg: '#FEF3C7', text: '#92400E' },
    PROCESSING: { bg: '#DBEAFE', text: '#1E40AF' },
    SHIPPED:    { bg: '#EDE9FE', text: '#5B21B6' },
    DELIVERED:  { bg: '#D1FAE5', text: '#065F46' },
    CANCELLED:  { bg: '#FEE2E2', text: '#991B1B' },
  };
  const colour = colours[status.toUpperCase()] ?? { bg: '#F3F4F6', text: '#374151' };
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return `<span style="display:inline-block;padding:4px 14px;border-radius:20px;background-color:${colour.bg};color:${colour.text};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">${label}</span>`;
}
