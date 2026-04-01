import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { Transaction, UserRole, TransactionType, Category } from "@/types/finance";
import { mockTransactions } from "@/data/mockTransactions";

interface Filters {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface DashboardContextType {
  transactions: Transaction[];
  role: UserRole;
  setRole: (role: UserRole) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredTransactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

const STORAGE_KEY = "finance-dashboard-transactions";

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : mockTransactions;
    } catch {
      return mockTransactions;
    }
  });
  const [role, setRole] = useState<UserRole>("admin");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== "all") result = result.filter((t) => t.type === filters.type);
    if (filters.category !== "all") result = result.filter((t) => t.category === filters.category);
    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const totalIncome = useMemo(() => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalBalance = totalIncome - totalExpenses;

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...tx, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <DashboardContext.Provider
      value={{ transactions, role, setRole, filters, setFilters, filteredTransactions, addTransaction, deleteTransaction, totalBalance, totalIncome, totalExpenses }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
