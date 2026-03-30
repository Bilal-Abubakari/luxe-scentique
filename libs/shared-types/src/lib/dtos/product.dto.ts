import { ProductVibe } from '../enums';
import { IPerfumeNotes } from '../interfaces/perfume.interface';

export interface CreateProductDto {
  title: string;
  brand: string;
  vibe?: ProductVibe;
  description?: string;
  notes?: IPerfumeNotes;
  price: number;
  stock: number;
  images?: string[];
  isActive?: boolean;
}

export interface UpdateProductDto {
  title?: string;
  brand?: string;
  vibe?: ProductVibe;
  description?: string;
  notes?: IPerfumeNotes;
  price?: number;
  stock?: number;
  images?: string[];
  isActive?: boolean;
}

export interface ProductQueryDto {
  page?: number;
  limit?: number;
  vibe?: ProductVibe;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  search?: string;
  isActive?: boolean;
}
