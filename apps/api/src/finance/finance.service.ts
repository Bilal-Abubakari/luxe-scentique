import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IExpense,
  IOtherIncome,
  IFinancialSummary,
  ICashFlowEntry,
  IExpenseByCategoryEntry,
  IPLReport,
  ExpenseCategory,
  OrderStatus,
} from '@luxe-scentique/shared-types';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  CreateOtherIncomeDto,
  UpdateOtherIncomeDto,
  FinancialQueryDto,
} from '@luxe-scentique/shared-types/dtos';

const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.INVENTORY_PURCHASE]: 'Inventory Purchase',
  [ExpenseCategory.SALARY]: 'Salary',
  [ExpenseCategory.RENT]: 'Rent',
  [ExpenseCategory.UTILITIES]: 'Utilities',
  [ExpenseCategory.MARKETING]: 'Marketing',
  [ExpenseCategory.SUPPLIES]: 'Supplies',
  [ExpenseCategory.TRANSPORT]: 'Transport',
  [ExpenseCategory.MAINTENANCE]: 'Maintenance',
  [ExpenseCategory.TAX]: 'Tax',
  [ExpenseCategory.INSURANCE]: 'Insurance',
  [ExpenseCategory.OTHER]: 'Other',
};

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Date Range Helpers ───────────────────────────────────────────────────

  private buildDateRange(query?: FinancialQueryDto): { gte?: Date; lte?: Date } {
    const range: { gte?: Date; lte?: Date } = {};
    if (query?.startDate) range.gte = new Date(query.startDate);
    if (query?.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      range.lte = end;
    }
    return range;
  }

  private defaultDateRange(): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  }

  // ─── Expenses CRUD ────────────────────────────────────────────────────────

  async createExpense(dto: CreateExpenseDto, recordedBy?: string): Promise<IExpense> {
    const expense = await this.prisma.expense.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        vendor: dto.vendor,
        description: dto.description,
        reference: dto.reference,
        receiptUrl: dto.receiptUrl,
        recordedBy: recordedBy,
      },
    });
    return expense as IExpense;
  }

  async findAllExpenses(query?: FinancialQueryDto): Promise<{ data: IExpense[]; total: number }> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(query);

    const where: Record<string, unknown> = {};
    if (Object.keys(dateRange).length > 0) where['date'] = dateRange;
    if (query?.category) where['category'] = query.category;

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { data: data as IExpense[], total };
  }

  async findOneExpense(id: string): Promise<IExpense> {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException(`Expense #${id} not found`);
    return expense as IExpense;
  }

  async updateExpense(id: string, dto: UpdateExpenseDto): Promise<IExpense> {
    await this.findOneExpense(id);
    const updated = await this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
    return updated as IExpense;
  }

  async deleteExpense(id: string): Promise<void> {
    await this.findOneExpense(id);
    await this.prisma.expense.delete({ where: { id } });
  }

  // ─── Other Income CRUD ────────────────────────────────────────────────────

  async createOtherIncome(dto: CreateOtherIncomeDto): Promise<IOtherIncome> {
    const income = await this.prisma.otherIncome.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        source: dto.source,
        description: dto.description,
        reference: dto.reference,
      },
    });
    return income as IOtherIncome;
  }

  async findAllOtherIncome(query?: FinancialQueryDto): Promise<{ data: IOtherIncome[]; total: number }> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(query);

    const where: Record<string, unknown> = {};
    if (Object.keys(dateRange).length > 0) where['date'] = dateRange;

    const [data, total] = await Promise.all([
      this.prisma.otherIncome.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.otherIncome.count({ where }),
    ]);

    return { data: data as IOtherIncome[], total };
  }

  async findOneOtherIncome(id: string): Promise<IOtherIncome> {
    const income = await this.prisma.otherIncome.findUnique({ where: { id } });
    if (!income) throw new NotFoundException(`Income entry #${id} not found`);
    return income as IOtherIncome;
  }

  async updateOtherIncome(id: string, dto: UpdateOtherIncomeDto): Promise<IOtherIncome> {
    await this.findOneOtherIncome(id);
    const updated = await this.prisma.otherIncome.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
    return updated as IOtherIncome;
  }

  async deleteOtherIncome(id: string): Promise<void> {
    await this.findOneOtherIncome(id);
    await this.prisma.otherIncome.delete({ where: { id } });
  }

  // ─── Financial Summary ────────────────────────────────────────────────────

  async getFinancialSummary(query?: FinancialQueryDto): Promise<IFinancialSummary> {
    const dateRange = this.buildDateRange(query);
    const dateFilter = Object.keys(dateRange).length > 0 ? dateRange : undefined;

    const [salesAgg, otherIncomeAgg, expenseAgg] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          isPaid: true,
          status: { not: OrderStatus.CANCELLED },
          ...(dateFilter ? { createdAt: dateFilter } : {}),
        },
      }),
      this.prisma.otherIncome.aggregate({
        _sum: { amount: true },
        where: dateFilter ? { date: dateFilter } : {},
      }),
      this.prisma.expense.aggregate({
        _sum: { amount: true },
        where: dateFilter ? { date: dateFilter } : {},
      }),
    ]);

    const salesRevenue = salesAgg._sum.total ?? 0;
    const otherIncome = otherIncomeAgg._sum.amount ?? 0;
    const totalRevenue = salesRevenue + otherIncome;
    const totalExpenses = expenseAgg._sum.amount ?? 0;
    const grossProfit = salesRevenue - totalExpenses;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      salesRevenue,
      otherIncome,
      totalRevenue,
      totalExpenses,
      grossProfit,
      netProfit,
      profitMargin,
      period: query?.period,
      startDate: query?.startDate,
      endDate: query?.endDate,
    };
  }

  // ─── Cash Flow ────────────────────────────────────────────────────────────

  async getCashFlow(query?: FinancialQueryDto): Promise<ICashFlowEntry[]> {
    const { startDate, endDate } = query?.startDate && query?.endDate
      ? { startDate: new Date(query.startDate), endDate: new Date(query.endDate) }
      : this.defaultDateRange();

    const [orders, incomes, expenses] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          isPaid: true,
          status: { not: OrderStatus.CANCELLED },
          createdAt: { gte: startDate, lte: endDate },
        },
        select: { createdAt: true, total: true },
      }),
      this.prisma.otherIncome.findMany({
        where: { date: { gte: startDate, lte: endDate } },
        select: { date: true, amount: true },
      }),
      this.prisma.expense.findMany({
        where: { date: { gte: startDate, lte: endDate } },
        select: { date: true, amount: true },
      }),
    ]);

    // Build daily map
    const dailyMap = new Map<string, { inflow: number; outflow: number }>();
    const addDay = (dateKey: string) => {
      if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, { inflow: 0, outflow: 0 });
    };

    orders.forEach((o) => {
      const key = o.createdAt.toISOString().split('T')[0];
      addDay(key);
      dailyMap.get(key)!.inflow += o.total;
    });

    incomes.forEach((i) => {
      const key = new Date(i.date).toISOString().split('T')[0];
      addDay(key);
      dailyMap.get(key)!.inflow += i.amount;
    });

    expenses.forEach((e) => {
      const key = new Date(e.date).toISOString().split('T')[0];
      addDay(key);
      dailyMap.get(key)!.outflow += e.amount;
    });

    // Sort and build cumulative
    const sorted = Array.from(dailyMap.entries()).sort(([a], [b]) => a.localeCompare(b));
    let cumulative = 0;
    return sorted.map(([date, { inflow, outflow }]) => {
      const net = inflow - outflow;
      cumulative += net;
      const [, month, day] = date.split('-');
      return {
        date,
        label: `${month}/${day}`,
        inflow,
        outflow,
        net,
        cumulativeNet: cumulative,
      };
    });
  }

  // ─── P&L Report ───────────────────────────────────────────────────────────

  async getPLReport(query?: FinancialQueryDto): Promise<IPLReport> {
    const dateRange = this.buildDateRange(query);
    const dateFilter = Object.keys(dateRange).length > 0 ? dateRange : undefined;

    const [summary, cashFlow, allExpenses, allIncomes, topExpenses] = await Promise.all([
      this.getFinancialSummary(query),
      this.getCashFlow(query),
      this.prisma.expense.findMany({
        where: dateFilter ? { date: dateFilter } : {},
        orderBy: { date: 'desc' },
        take: 10,
      }),
      this.prisma.otherIncome.findMany({
        where: dateFilter ? { date: dateFilter } : {},
        orderBy: { date: 'desc' },
        take: 10,
      }),
      this.prisma.expense.findMany({
        where: dateFilter ? { date: dateFilter } : {},
        orderBy: { amount: 'desc' },
        take: 5,
      }),
    ]);

    // Expenses by category
    const categoryMap = new Map<string, number>();
    await Promise.all(
      Object.values(ExpenseCategory).map(async (cat) => {
        const agg = await this.prisma.expense.aggregate({
          _sum: { amount: true },
          where: {
            category: cat,
            ...(dateFilter ? { date: dateFilter } : {}),
          },
        });
        const amount = agg._sum.amount ?? 0;
        if (amount > 0) categoryMap.set(cat, amount);
      })
    );

    const totalExpenses = summary.totalExpenses;
    const expensesByCategory: IExpenseByCategoryEntry[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        label: EXPENSE_CATEGORY_LABELS[category as ExpenseCategory],
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      summary,
      expensesByCategory,
      cashFlow,
      topExpenses: topExpenses as IExpense[],
      recentExpenses: allExpenses as IExpense[],
      recentIncome: allIncomes as IOtherIncome[],
    };
  }
}

