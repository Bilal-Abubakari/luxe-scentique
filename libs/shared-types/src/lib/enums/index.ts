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
