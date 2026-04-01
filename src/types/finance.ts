export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Shopping"
  | "Utilities"
  | "Healthcare"
  | "Education"
  | "Investment"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export type UserRole = "viewer" | "admin";
