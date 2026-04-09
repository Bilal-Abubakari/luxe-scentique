-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('INVENTORY_PURCHASE', 'SALARY', 'RENT', 'UTILITIES', 'MARKETING', 'SUPPLIES', 'TRANSPORT', 'MAINTENANCE', 'TAX', 'INSURANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "IncomeCategory" AS ENUM ('INVESTMENT', 'LOAN', 'GRANT', 'REFUND', 'COMMISSION', 'OTHER');

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vendor" TEXT,
    "description" TEXT,
    "reference" TEXT,
    "receiptUrl" TEXT,
    "recordedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "other_income" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" "IncomeCategory" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "description" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "other_income_pkey" PRIMARY KEY ("id")
);
