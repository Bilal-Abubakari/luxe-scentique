import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  IOrder,
  IAuthUser,
  Role,
  OrderStatus,
} from '@luxe-scentique/shared-types';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderLookupDto,
  CreateWalkInOrderDto,
} from '@luxe-scentique/shared-types/dtos';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order (online checkout)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  create(@Body() dto: CreateOrderDto, @Query('userId') userId?: string): Promise<IOrder> {
    return this.ordersService.create(dto, userId);
  }

  @Post('walk-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a walk-in POS sale (Admin only)' })
  @ApiResponse({ status: 201, description: 'Walk-in sale recorded' })
  createWalkIn(@Body() dto: CreateWalkInOrderDto): Promise<IOrder> {
    return this.ordersService.createWalkIn(dto);
  }

  @Post('lookup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lookup orders by email, phone, or order number (no login required)' })
  @ApiResponse({ status: 200, description: 'Returns matching orders' })
  lookup(@Body() dto: OrderLookupDto): Promise<IOrder[]> {
    return this.ordersService.lookup(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: IOrder[]; total: number }> {
    return this.ordersService.findAll({
      status,
      page: page ? Number.parseInt(page, 10) : undefined,
      limit: limit ? Number.parseInt(limit, 10) : undefined,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get orders for the authenticated customer' })
  findMyOrders(@CurrentUser() user: IAuthUser): Promise<{ data: IOrder[]; total: number }> {
    return this.ordersService.findAll({ page: 1, limit: 50 });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Returns the order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string): Promise<IOrder> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto): Promise<IOrder> {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Mark order as paid after Paystack verification' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  markAsPaid(
    @Param('id') id: string,
    @Body('reference') reference: string,
  ): Promise<IOrder> {
    return this.ordersService.markAsPaid(id, reference);
  }
}
