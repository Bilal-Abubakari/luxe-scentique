import { OrderStatus, PaymentMethod } from '../enums';

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  items: CreateOrderItemDto[];
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderLookupDto {
  identifier: string; // email, phone number, or order number
}

export interface CreateWalkInOrderDto {
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  items: CreateOrderItemDto[];
  notes?: string;
  amountPaid?: number;
}

export interface PaystackInitializeDto {
  orderId: string;
  callbackUrl?: string;
}

export interface PaystackVerifyDto {
  reference: string;
}
