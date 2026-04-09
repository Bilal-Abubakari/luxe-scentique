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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  IExpense,
  IOtherIncome,
  IFinancialSummary,
  ICashFlowEntry,
  IPLReport,
  Role,
  IAuthUser,
} from '@luxe-scentique/shared-types';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  CreateOtherIncomeDto,
  UpdateOtherIncomeDto,
  FinancialQueryDto,
} from '@luxe-scentique/shared-types/dtos';

@ApiTags('finance')
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ─── Expenses ─────────────────────────────────────────────────────────────

  @Post('expenses')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created' })
  createExpense(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<IExpense> {
    return this.financeService.createExpense(dto, user?.email);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Get all expenses with optional filters' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllExpenses(
    @Query() query: FinancialQueryDto,
  ): Promise<{ data: IExpense[]; total: number }> {
    return this.financeService.findAllExpenses(query);
  }

  @Get('expenses/:id')
  @ApiOperation({ summary: 'Get a single expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  findOneExpense(@Param('id') id: string): Promise<IExpense> {
    return this.financeService.findOneExpense(id);
  }

  @Patch('expenses/:id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  updateExpense(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ): Promise<IExpense> {
    return this.financeService.updateExpense(id, dto);
  }

  @Delete('expenses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  deleteExpense(@Param('id') id: string): Promise<void> {
    return this.financeService.deleteExpense(id);
  }

  // ─── Other Income ─────────────────────────────────────────────────────────

  @Post('income')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new other income entry' })
  @ApiResponse({ status: 201, description: 'Income entry created' })
  createOtherIncome(@Body() dto: CreateOtherIncomeDto): Promise<IOtherIncome> {
    return this.financeService.createOtherIncome(dto);
  }

  @Get('income')
  @ApiOperation({ summary: 'Get all other income entries with optional filters' })
  findAllOtherIncome(
    @Query() query: FinancialQueryDto,
  ): Promise<{ data: IOtherIncome[]; total: number }> {
    return this.financeService.findAllOtherIncome(query);
  }

  @Get('income/:id')
  @ApiOperation({ summary: 'Get a single income entry by ID' })
  @ApiParam({ name: 'id', description: 'Income ID' })
  findOneOtherIncome(@Param('id') id: string): Promise<IOtherIncome> {
    return this.financeService.findOneOtherIncome(id);
  }

  @Patch('income/:id')
  @ApiOperation({ summary: 'Update an income entry' })
  @ApiParam({ name: 'id', description: 'Income ID' })
  updateOtherIncome(
    @Param('id') id: string,
    @Body() dto: UpdateOtherIncomeDto,
  ): Promise<IOtherIncome> {
    return this.financeService.updateOtherIncome(id, dto);
  }

  @Delete('income/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an income entry' })
  @ApiParam({ name: 'id', description: 'Income ID' })
  deleteOtherIncome(@Param('id') id: string): Promise<void> {
    return this.financeService.deleteOtherIncome(id);
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary (revenue, expenses, profit/loss)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'period', required: false, type: String })
  getFinancialSummary(@Query() query: FinancialQueryDto): Promise<IFinancialSummary> {
    return this.financeService.getFinancialSummary(query);
  }

  @Get('cashflow')
  @ApiOperation({ summary: 'Get daily cash flow data (inflow vs outflow)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  getCashFlow(@Query() query: FinancialQueryDto): Promise<ICashFlowEntry[]> {
    return this.financeService.getCashFlow(query);
  }

  @Get('pl-report')
  @ApiOperation({ summary: 'Get full profit & loss report' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  getPLReport(@Query() query: FinancialQueryDto): Promise<IPLReport> {
    return this.financeService.getPLReport(query);
  }
}

