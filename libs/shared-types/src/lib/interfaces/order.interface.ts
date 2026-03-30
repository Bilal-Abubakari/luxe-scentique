import { OrderStatus, PaymentMethod } from '../enums';

export interface IOrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string | null;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerEmail: string;
  customerPhone: string | null;
  customerName: string | null;
  items: IOrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentRef: string | null;
  isPaid: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderLookup {
  identifier: string; // email, phone, or order ID
}

export interface IOrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
}
