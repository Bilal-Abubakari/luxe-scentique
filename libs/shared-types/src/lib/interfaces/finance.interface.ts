import { ExpenseCategory, IncomeCategory, FinancialPeriod } from '../enums';

export interface IExpense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date | string;
  vendor?: string | null;
  description?: string | null;
  reference?: string | null;
  receiptUrl?: string | null;
  recordedBy?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IOtherIncome {
  id: string;
  title: string;
  amount: number;
  category: IncomeCategory;
  date: Date | string;
  source?: string | null;
  description?: string | null;
  reference?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IFinancialSummary {
  salesRevenue: number;
  otherIncome: number;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  period?: FinancialPeriod;
  startDate?: string;
  endDate?: string;
}

export interface ICashFlowEntry {
  date: string;
  label: string;
  inflow: number;
  outflow: number;
  net: number;
  cumulativeNet: number;
}

export interface IExpenseByCategoryEntry {
  category: ExpenseCategory;
  label: string;
  amount: number;
  percentage: number;
}

export interface IPLReport {
  summary: IFinancialSummary;
  expensesByCategory: IExpenseByCategoryEntry[];
  cashFlow: ICashFlowEntry[];
  topExpenses: IExpense[];
  recentExpenses: IExpense[];
  recentIncome: IOtherIncome[];
}

