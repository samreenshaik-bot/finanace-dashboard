import { useDashboard } from "@/context/DashboardContext";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses, transactions } = useDashboard();
  const txCount = transactions.length;

  const cards = [
    { label: "Total Balance", value: fmt(totalBalance), icon: Wallet, color: "text-primary" },
    { label: "Income", value: fmt(totalIncome), icon: TrendingUp, color: "text-success" },
    { label: "Expenses", value: fmt(totalExpenses), icon: TrendingDown, color: "text-destructive" },
    { label: "Transactions", value: txCount.toString(), icon: DollarSign, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
