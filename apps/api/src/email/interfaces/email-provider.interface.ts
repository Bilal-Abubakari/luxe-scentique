export const EMAIL_PROVIDER = 'EMAIL_PROVIDER' as const;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  /** Override the default from address */
  from?: string;
}

/**
 * Provider-agnostic email sending contract.
 * Swap implementations (Mailtrap → SendGrid → SES etc.) by changing
 * the class bound to EMAIL_PROVIDER in EmailModule — no other code changes needed.
 */
export interface IEmailProvider {
  send(options: SendEmailOptions): Promise<void>;
}
