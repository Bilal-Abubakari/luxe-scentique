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

  r2: {
    accountId: process.env['R2_ACCOUNT_ID'] ?? '',
    accessKeyId: process.env['R2_ACCESS_KEY_ID'] ?? '',
    secretAccessKey: process.env['R2_SECRET_ACCESS_KEY'] ?? '',
    bucketName: process.env['R2_BUCKET_NAME'] ?? 'luxe-scentique-assets',
    publicUrl: process.env['R2_PUBLIC_URL'] ?? '',
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
