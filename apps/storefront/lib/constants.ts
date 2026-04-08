/**
 * Luxe Scentique — Brand Constants
 * Single source of truth for all social links and contact information.
 * Update here and the entire application reflects the change.
 */

export const SOCIAL_LINKS = {
  instagram: {
    url: 'https://www.instagram.com/hudahs_perfumery?igsh=MWF0amh2ZmZtdnpmcQ%3D%3D&utm_source=qr',
    label: 'Instagram',
    handle: '@hudahs_perfumery',
    ariaLabel: 'Follow @hudahs_perfumery on Instagram (opens in new tab)',
    description: 'Daily fragrance inspiration, new arrivals, and behind-the-scenes moments.',
  },
  snapchat: {
    url: 'https://snapchat.com/t/VX0f9boA',
    label: 'Snapchat',
    handle: 'hudahs_perfumery',
    ariaLabel: 'Add us on Snapchat (opens in new tab)',
    description: 'Exclusive sneak peeks, limited drops, and candid stories from our world.',
  },
  whatsapp: {
    url: 'https://wa.me/233593500918',
    label: 'WhatsApp',
    handle: '+233 59 350 0918',
    ariaLabel: 'Chat with us on WhatsApp (opens in new tab)',
    description: 'Order directly, ask questions, or just say hello — we reply fast.',
  },
} as const;

export const CONTACT_INFO = {
  phone: '+233557309018',
  phoneDisplay: '+233 55 730 9018',
  phoneHref: 'tel:+233557309018',
  whatsappUrl: 'https://wa.me/233593500918',
  email: 'luxescentique.parfum@gmail.com',
  address: {
    street: 'Lakeside Community, 10 Dragon Street',
    city: 'Accra',
    country: 'Ghana',
    full: 'Lakeside Community, 10 Dragon Street, Accra, Ghana',
    mapsQuery: 'Lakeside+Community+10+Dragon+Street+Accra+Ghana',
  },
} as const;

