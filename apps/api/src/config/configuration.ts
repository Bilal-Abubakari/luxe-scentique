export const configuration = () => ({
  port: Number.parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:4200',
  adminUrl: process.env['ADMIN_URL'] ?? 'http://localhost:4201',

  database: {
    url: process.env['DATABASE_URL'] ?? '',
  },

  jwt: {
    secret: process.env['JWT_SECRET'] ?? 'change-this-in-production',
    expiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
  },

  google: {
    clientId: process.env['GOOGLE_CLIENT_ID'] ?? '',
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ?? '',
    callbackUrl: process.env['GOOGLE_CALLBACK_URL'] ?? 'http://localhost:3000/api/v1/auth/google/callback',
  },

  paystack: {
    secretKey: process.env['PAYSTACK_SECRET_KEY'] ?? '',
    publicKey: process.env['PAYSTACK_PUBLIC_KEY'] ?? '',
    baseUrl: process.env['PAYSTACK_BASE_URL'] ?? 'https://api.paystack.co',
    // Service fee: 1.95% of subtotal, capped at GHS 1000, minimum 50p
    serviceFeeRate: 0.0195,
    serviceFeeCap: 1000,
    serviceFeeMin: 0.5,
  },

  cloudinary: {
    apiKey: process.env['CLOUDINARY_API_KEY'] ?? '',
    apiSecret: process.env['CLOUDINARY_API_SECRET'] ?? '',
    baseUrl: process.env['CLOUDINARY_BASE_URL'] ?? '',
    presets: {
      PRODUCTS: process.env['CLOUDINARY_PRODUCTS'] ?? '',
    },
  },

  email: {
    /**
     * Which transport to use: "mailtrap" (default/dev) or "smtp" (production).
     * Set EMAIL_PROVIDER=smtp and supply SMTP_* env vars to switch providers.
     */
    provider: process.env['EMAIL_PROVIDER'] ?? 'mailtrap',
    from: {
      name: process.env['EMAIL_FROM_NAME'] ?? 'Luxe Scentique',
      address: process.env['EMAIL_FROM_ADDRESS'] ?? 'noreply@luxescentique.com',
    },
    /** Mailtrap sandbox — ideal for development and staging */
    mailtrap: {
      host: process.env['MAILTRAP_HOST'] ?? 'sandbox.smtp.mailtrap.io',
      port: Number.parseInt(process.env['MAILTRAP_PORT'] ?? '2525', 10),
      user: process.env['MAILTRAP_USER'] ?? '',
      pass: process.env['MAILTRAP_PASS'] ?? '',
    },
    /** Generic SMTP — use for SendGrid, Mailgun, Postmark, AWS SES, etc. */
    smtp: {
      host: process.env['SMTP_HOST'] ?? '',
      port: Number.parseInt(process.env['SMTP_PORT'] ?? '587', 10),
      secure: process.env['SMTP_SECURE'] === 'true',
      user: process.env['SMTP_USER'] ?? '',
      pass: process.env['SMTP_PASS'] ?? '',
    },
    /** Admin inbox that receives a notification every time a new order is placed. */
    adminNotificationEmail: process.env['ADMIN_NOTIFICATION_EMAIL'] ?? 'luxescentique.parfum@gmail.com',
  },

  superAdmin: {
    emails: (
      process.env['SUPER_ADMIN_EMAILS'] ??
      'abubakaribilal99@gmail.com,bawahuda22@gmail.com'
    )
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean),
  },
});

export type AppConfig = ReturnType<typeof configuration>;
