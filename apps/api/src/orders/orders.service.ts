import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { EmailService } from '../email/email.service';
import {
  IOrder,
  OrderStatus,
  PaymentMethod,
} from '@luxe-scentique/shared-types';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderLookupDto,
  CreateWalkInOrderDto,
} from '@luxe-scentique/shared-types/dtos';

// Explicit shape of an order row with nested includes (avoids Prisma.OrderGetPayload before client generation)
type OrderWithItems = {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerEmail: string;
  customerPhone: string | null;
  customerName: string | null;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentRef: string | null;
  isPaid: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: { id: string; title: string; images: string[] };
  }>;
};

const ORDER_INCLUDE = { items: { include: { product: true } } } as const;

@Injectable()
export class OrdersService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateOrderDto, customerId?: string): Promise<IOrder> {
    const products = await this.validateAndGetProducts(dto.items.map((i) => i.productId));

    const itemsWithPrice = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.title}`);
      }
      return { ...item, price: product.price };
    });

    const subtotal = itemsWithPrice.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const { serviceFee, total } = this.paymentsService.calculateServiceFee(subtotal);
    const orderNumber = this.generateOrderNumber();

    const order = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of itemsWithPrice) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber,
          customerId: customerId ?? null,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          customerName: dto.customerName,
          subtotal,
          serviceFee,
          total,
          paymentMethod: (dto.paymentMethod as PaymentMethod) ?? PaymentMethod.ONLINE,
          notes: dto.notes,
          items: {
            create: itemsWithPrice.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: ORDER_INCLUDE,
      });
    });

    const mapped = this.mapOrder(order);
    // Fire-and-forget — emails must not block or fail the order response
    void this.emailService.sendOrderConfirmation(mapped);
    void this.emailService.sendAdminOrderNotification(mapped);
    return mapped;
  }

  async createWalkIn(dto: CreateWalkInOrderDto): Promise<IOrder> {
    const order = await this.create({
      ...dto,
      customerEmail: dto.customerEmail ?? '',
      paymentMethod: PaymentMethod.WALK_IN,
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { isPaid: true, status: OrderStatus.PROCESSING },
    });

    return { ...order, isPaid: true, status: OrderStatus.PROCESSING };
  }

  async findAll(filters?: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: IOrder[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = filters?.status ? { status: filters.status } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: ORDER_INCLUDE,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data: (orders as OrderWithItems[]).map((o) => this.mapOrder(o)), total };
  }

  async findOne(id: string): Promise<IOrder> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return this.mapOrder(order);
  }

  async lookup(dto: OrderLookupDto): Promise<IOrder[]> {
    const { identifier } = dto;
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { contains: identifier, mode: 'insensitive' as const } },
          { customerEmail: { contains: identifier, mode: 'insensitive' as const } },
          { customerPhone: { contains: identifier, mode: 'insensitive' as const } },
        ],
      },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return (orders as OrderWithItems[]).map((o) => this.mapOrder(o));
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<IOrder> {
    const existing = await this.findOne(id);

    const order = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (
        dto.status === OrderStatus.CANCELLED &&
        existing.status !== OrderStatus.CANCELLED
      ) {
        for (const item of existing.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: dto.status },
        include: ORDER_INCLUDE,
      });
    });

    const mapped = this.mapOrder(order);
    void this.emailService.sendOrderStatusUpdate(mapped);
    return mapped;
  }

  async markAsPaid(id: string, paymentRef: string): Promise<IOrder> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { isPaid: true, paymentRef, status: OrderStatus.PROCESSING },
      include: ORDER_INCLUDE,
    });
    return this.mapOrder(order);
  }

  private async validateAndGetProducts(
    productIds: string[],
  ): Promise<Array<{ id: string; title: string; price: number; stock: number }>> {
    return this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, title: true, price: true, stock: true },
    });
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LSQ-${timestamp}-${random}`;
  }

  private mapOrder(order: OrderWithItems): IOrder {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerName: order.customerName,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productTitle: item.product.title,
        productImage: item.product.images[0] ?? null,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      serviceFee: order.serviceFee,
      total: order.total,
      status: order.status as OrderStatus,
      paymentMethod: order.paymentMethod as PaymentMethod,
      paymentRef: order.paymentRef,
      isPaid: order.isPaid,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
