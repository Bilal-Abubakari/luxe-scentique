import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailProvider, SendEmailOptions } from '../interfaces/email-provider.interface';

/**
 * Nodemailer-backed email provider.
 *
 * Supports two transport modes, chosen by EMAIL_PROVIDER env var:
 *   - "mailtrap"  → Mailtrap sandbox SMTP (default, great for dev/staging)
 *   - "smtp"      → Any generic SMTP server (production / other providers)
 *
 * To switch providers: set EMAIL_PROVIDER=smtp and supply the SMTP_* env vars.
 * The rest of the application (EmailService, templates) is untouched.
 */
@Injectable()
export class NodemailerProvider implements IEmailProvider {
  private readonly logger = new Logger(NodemailerProvider.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    this.fromAddress = this.buildFromAddress();
    this.transporter = this.createTransporter();
  }

  async send(options: SendEmailOptions): Promise<void> {
    const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    try {
      const info = await this.transporter.sendMail({
        from: options.from ?? this.fromAddress,
        to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      this.logger.log(`Email sent | subject="${options.subject}" to="${to}" id=${info.messageId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      this.logger.error(`Email failed | subject="${options.subject}" to="${to}" — ${message}`, stack);
      throw err;
    }
  }

  // ---------------------------------------------------------------------------

  private buildFromAddress(): string {
    const name = this.config.get<string>('email.from.name') ?? 'Luxe Scentique';
    const address = this.config.get<string>('email.from.address') ?? 'noreply@luxescentique.com';
    return `"${name}" <${address}>`;
  }

  private createTransporter(): nodemailer.Transporter {
    const provider = this.config.get<string>('email.provider') ?? 'mailtrap';

    if (provider === 'mailtrap') {
      return nodemailer.createTransport({
        host: this.config.get<string>('email.mailtrap.host') ?? 'sandbox.smtp.mailtrap.io',
        port: this.config.get<number>('email.mailtrap.port') ?? 2525,
        auth: {
          user: this.config.get<string>('email.mailtrap.user') ?? '',
          pass: this.config.get<string>('email.mailtrap.pass') ?? '',
        },
      });
    }

    // Generic SMTP — covers SendGrid, Mailgun, Postmark, AWS SES, etc.
    return nodemailer.createTransport({
      host: this.config.get<string>('email.smtp.host') ?? '',
      port: this.config.get<number>('email.smtp.port') ?? 587,
      secure: this.config.get<boolean>('email.smtp.secure') ?? false,
      auth: {
        user: this.config.get<string>('email.smtp.user') ?? '',
        pass: this.config.get<string>('email.smtp.pass') ?? '',
      },
    });
  }
}
