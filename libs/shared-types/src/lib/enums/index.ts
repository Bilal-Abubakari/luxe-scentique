export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  ONLINE = 'ONLINE',
  WALK_IN = 'WALK_IN',
}

export enum ProductVibe {
  CORPORATE = 'CORPORATE',
  CASUAL = 'CASUAL',
  EVENING = 'EVENING',
  SPORT = 'SPORT',
  UNISEX = 'UNISEX',
  FEMININE = 'FEMININE',
  MASCULINE = 'MASCULINE',
}

export enum Currency {
  GHS = 'GHS',
  USD = 'USD',
}

export enum Language {
  EN = 'en',
  FR = 'fr',
}

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

export enum ExpenseCategory {
  INVENTORY_PURCHASE = 'INVENTORY_PURCHASE',
  SALARY = 'SALARY',
  RENT = 'RENT',
  UTILITIES = 'UTILITIES',
  MARKETING = 'MARKETING',
  SUPPLIES = 'SUPPLIES',
  TRANSPORT = 'TRANSPORT',
  MAINTENANCE = 'MAINTENANCE',
  TAX = 'TAX',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

export enum IncomeCategory {
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  GRANT = 'GRANT',
  REFUND = 'REFUND',
  COMMISSION = 'COMMISSION',
  OTHER = 'OTHER',
}

export enum FinancialPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

