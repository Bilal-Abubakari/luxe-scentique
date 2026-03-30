import { ProductVibe } from '../enums';

export interface IPerfume {
  id: string;
  title: string;
  brand: string;
  vibe: ProductVibe | null;
  description: string | null;
  notes: IPerfumeNotes | null;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPerfumeNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface IPerfumeFilter {
  vibe?: ProductVibe;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  search?: string;
}

export interface IPerfumePaginated {
  data: IPerfume[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IServiceFeeCalculation {
  subtotal: number;
  serviceFee: number;
  total: number;
}
