import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerProvider } from './providers/nodemailer.provider';
import { EMAIL_PROVIDER } from './interfaces/email-provider.interface';

/**
 * EmailModule — provider-agnostic transactional email.
 *
 * To swap the email provider (e.g. to SendGrid, Mailgun, AWS SES):
 *   1. Create a new provider class in `./providers/` that implements `IEmailProvider`.
 *   2. Change `useClass: NodemailerProvider` below to your new class.
 *   3. Add the required env vars to configuration.ts and your .env files.
 *   No other code changes are needed.
 */
@Module({
  providers: [
    // The concrete transport bound to the IEmailProvider contract
    {
      provide: EMAIL_PROVIDER,
      useClass: NodemailerProvider,
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
