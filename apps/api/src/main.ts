import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Global prefix
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // CORS
  app.enableCors({
    origin: [
      process.env['FRONTEND_URL'] ?? 'http://localhost:5000',
      process.env['ADMIN_URL'] ?? 'http://localhost:4201',
    ],
    credentials: true,
  });

  // Global validation pipe (strict - no unknown properties)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger / OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Luxe Scentique API')
    .setDescription(
      'RESTful API for the Luxe Scentique high-end perfume e-commerce platform. ' +
        'Supports storefront operations, admin management, and POS walk-in sales.',
    )
    .setVersion('1.0')
    .setContact('Luxe Scentique', '', 'abubakaribilal99@gmail.com')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication & authorization')
    .addTag('products', 'Perfume product management')
    .addTag('orders', 'Order management')
    .addTag('payments', 'Paystack payment integration')
    .addTag('storage', 'Cloudflare R2 file storage')
    .addTag('users', 'User management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Luxe Scentique API Docs',
  });

  const port = process.env['PORT'] ?? 3003;
  await app.listen(port);

  logger.log(`🚀 API running at: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📖 Swagger docs at: http://localhost:${port}/docs`);
}

bootstrap(); //NOSONAR
