import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseCategory, IncomeCategory, FinancialPeriod } from '../enums';
export class CreateExpenseDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsNumber() @IsPositive() amount!: number;
  @IsEnum(ExpenseCategory) category!: ExpenseCategory;
  @IsDateString() date!: string;
  @IsOptional() @IsString() vendor?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() receiptUrl?: string;
}
export class UpdateExpenseDto {
  @IsOptional() @IsString() @IsNotEmpty() title?: string;
  @IsOptional() @IsNumber() @IsPositive() amount?: number;
  @IsOptional() @IsEnum(ExpenseCategory) category?: ExpenseCategory;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() vendor?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() receiptUrl?: string;
}
export class CreateOtherIncomeDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsNumber() @IsPositive() amount!: number;
  @IsEnum(IncomeCategory) category!: IncomeCategory;
  @IsDateString() date!: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() reference?: string;
}
export class UpdateOtherIncomeDto {
  @IsOptional() @IsString() @IsNotEmpty() title?: string;
  @IsOptional() @IsNumber() @IsPositive() amount?: number;
  @IsOptional() @IsEnum(IncomeCategory) category?: IncomeCategory;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() reference?: string;
}
export class FinancialQueryDto {
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsEnum(FinancialPeriod) period?: FinancialPeriod;
  @IsOptional() @IsEnum(ExpenseCategory) category?: ExpenseCategory;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number;
}
