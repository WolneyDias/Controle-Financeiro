export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryStats {
  name: string;
  value: number;
  color: string;
}