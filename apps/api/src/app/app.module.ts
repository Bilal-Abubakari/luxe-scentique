import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsModule } from '../payments/payments.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { configuration } from '../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Config (global) - must be first
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting — three tiers applied globally; sensitive routes override via @Throttle()
    ThrottlerModule.forRoot([
      {
        name: 'burst',
        ttl: 1_000,    // 1 second window
        limit: 10,     // max 10 req/s per IP (burst protection)
      },
      {
        name: 'sustained',
        ttl: 60_000,   // 1 minute window
        limit: 100,    // max 100 req/min per IP
      },
      {
        name: 'hourly',
        ttl: 3_600_000, // 1 hour window
        limit: 1_000,   // max 1 000 req/hr per IP
      },
    ]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    StorageModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    // Apply ThrottlerGuard globally — all routes are rate-limited unless @SkipThrottle() is used
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
