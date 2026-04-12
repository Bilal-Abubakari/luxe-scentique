import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StorageService, UploadPresets } from '../storage/storage.service';
import {
  IPerfume,
  IPerfumePaginated,
  Role,
  ProductVibe,
} from '@luxe-scentique/shared-types';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from '@luxe-scentique/shared-types/dtos';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new perfume product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<IPerfume> {
    if (!files?.length) {
      throw new BadRequestException('At least one product image is required.');
    }
    const images = await Promise.all(files.map((f) => this.storageService.upload(f, UploadPresets.PRODUCTS)));
    return this.productsService.create({ ...dto, images });
  }

  @Get()
  @ApiOperation({ summary: 'Get all active perfumes with optional filtering' })
  @ApiResponse({ status: 200, description: 'Returns paginated product list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'vibe', required: false, enum: ProductVibe })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(@Query() query: ProductQueryDto): Promise<IPerfumePaginated> {
    return this.productsService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products ranked by purchase frequency (last 90 days)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of products to return (1–20, default 6)' })
  @ApiResponse({ status: 200, description: 'Returns featured products sorted by sales rank, padded with newest products' })
  getFeatured(@Query('limit') limit?: string): Promise<IPerfume[]> {
    const n = Math.min(Math.max(parseInt(limit ?? '6', 10) || 6, 1), 20);
    return this.productsService.getFeatured(n);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single perfume by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Returns the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string): Promise<IPerfume> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a perfume product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<IPerfume> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a perfume product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
