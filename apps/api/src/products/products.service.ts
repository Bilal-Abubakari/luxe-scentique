import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  IPerfumePaginated,
  IPerfume,
  ProductVibe,
} from '@luxe-scentique/shared-types';

type PrismaProductRow = {
  id: string;
  title: string;
  brand: string;
  vibe: string | null;
  description: string | null;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

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
      data: (data as PrismaProductRow[]).map((p) => this.mapProduct(p)),
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

  private buildProductWhere(query: ProductQueryDto) {
    const { vibe, minPrice, maxPrice, brand, inStock, search, isActive } = query;
    const priceFilter = this.buildPriceFilter(minPrice, maxPrice);
    return {
      isActive: isActive ?? true,
      ...(vibe ? { vibe } : {}),
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

  private mapProduct(product: PrismaProductRow): IPerfume {
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
