import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  IPerfumePaginated,
  IPerfume,
  ProductVibe,
  OrderStatus,
} from '@luxe-scentique/shared-types';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from '@luxe-scentique/shared-types/dtos';


@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<IPerfume> {
    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        brand: dto.brand,
        vibe: dto.vibe ?? null,
        description: dto.description,
        topNotes: dto.notes?.top ?? [],
        middleNotes: dto.notes?.middle ?? [],
        baseNotes: dto.notes?.base ?? [],
        price: dto.price,
        stock: dto.stock,
        images: dto.images ?? [],
        isActive: dto.isActive ?? true,
      },
    });

    return this.mapProduct(product);
  }

  async findAll(query: ProductQueryDto): Promise<IPerfumePaginated> {
    const { page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;
    const where = this.buildProductWhere(query);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: (data as Product[]).map((p) => this.mapProduct(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<IPerfume> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return this.mapProduct(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<IPerfume> {
    await this.findOne(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: this.buildUpdateData(dto),
    });
    return this.mapProduct(product);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
  }

  async adjustStock(id: string, quantity: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
  }

  async getFeatured(limit: number): Promise<IPerfume[]> {
    // Look back 90 days so rankings stay fresh and reflect recent demand
    const since = new Date();
    since.setDate(since.getDate() - 90);

    // Rank products by total units sold from paid, non-cancelled orders
    const salesRanking = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          isPaid: true,
          status: { not: OrderStatus.CANCELLED },
          createdAt: { gte: since },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit * 2, // over-fetch to account for inactive / out-of-stock products
    });

    const rankedIds = salesRanking.map((r) => r.productId);

    // Fetch only active, in-stock products from the ranked set
    const soldProducts = rankedIds.length
      ? await this.prisma.product.findMany({
          where: { id: { in: rankedIds }, isActive: true, stock: { gt: 0 } },
        })
      : [];

    // Re-sort to preserve the sales-rank order returned by groupBy
    const productMap = new Map(soldProducts.map((p) => [p.id, p]));
    const ranked = rankedIds
      .map((id) => productMap.get(id))
      .filter((p): p is Product => p !== undefined);

    // Pad with randomly selected active in-stock products when bestsellers aren't enough.
    // Fetch a pool larger than needed, shuffle it in JS, then take what's required.
    // This avoids raw SQL and keeps the approach database-agnostic.
    if (ranked.length < limit) {
      const needed = limit - ranked.length;
      const poolSize = Math.max(needed * 5, 50); // wide pool → better randomness

      const pool = await this.prisma.product.findMany({
        where: {
          id: { notIn: ranked.map((p) => p.id) },
          isActive: true,
          stock: { gt: 0 },
        },
        take: poolSize,
      });

      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j]!, pool[i]!];
      }

      ranked.push(...(pool.slice(0, needed) as Product[]));
    }

    return ranked.slice(0, limit).map((p) => this.mapProduct(p));
  }

  private buildProductWhere(query: ProductQueryDto): Prisma.ProductWhereInput {
    const { vibe, minPrice, maxPrice, brand, inStock, search, isActive } = query;
    const priceFilter = this.buildPriceFilter(minPrice, maxPrice);
    const isActiveFilter = isActive === undefined ? undefined : { isActive };
    return {
      ...isActiveFilter,
      // shared-types ProductVibe (TS enum) and Prisma's $Enums.ProductVibe (string union)
      // are structurally identical but nominally distinct — cast to bridge the gap.
      ...(vibe ? { vibe: vibe as unknown as Prisma.ProductWhereInput['vibe'] } : {}),
      ...(brand ? { brand: { contains: brand, mode: 'insensitive' as const } } : {}),
      ...(inStock ? { stock: { gt: 0 } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { brand: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(priceFilter ? { price: priceFilter } : {}),
    };
  }

  private buildPriceFilter(minPrice?: number, maxPrice?: number) {
    if (minPrice === undefined && maxPrice === undefined) return null;
    return {
      ...(minPrice === undefined ? {} : { gte: minPrice }),
      ...(maxPrice === undefined ? {} : { lte: maxPrice }),
    };
  }

  private buildUpdateData(dto: UpdateProductDto) {
    return {
      ...(dto.title ? { title: dto.title } : {}),
      ...(dto.brand ? { brand: dto.brand } : {}),
      ...(dto.vibe ? { vibe: dto.vibe } : {}),
      ...(dto.description === undefined ? {} : { description: dto.description }),
      ...(dto.notes
        ? { topNotes: dto.notes.top, middleNotes: dto.notes.middle, baseNotes: dto.notes.base }
        : {}),
      ...(dto.price === undefined ? {} : { price: dto.price }),
      ...(dto.stock === undefined ? {} : { stock: dto.stock }),
      ...(dto.images ? { images: dto.images } : {}),
      ...(dto.isActive === undefined ? {} : { isActive: dto.isActive }),
    };
  }

  private mapProduct(product: Product): IPerfume {
    return {
      id: product.id,
      title: product.title,
      brand: product.brand,
      vibe: (product.vibe as ProductVibe) ?? null,
      description: product.description,
      notes: {
        top: product.topNotes,
        middle: product.middleNotes,
        base: product.baseNotes,
      },
      price: product.price,
      stock: product.stock,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
