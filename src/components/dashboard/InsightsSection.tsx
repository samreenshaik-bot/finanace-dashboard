import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function InsightsSection() {
  const { transactions } = useDashboard();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    if (expenses.length === 0) return null;

    // Highest spending category
    const catMap: Record<string, number> = {};
    expenses.forEach((t) => (catMap[t.category] = (catMap[t.category] || 0) + t.amount));
    const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison
    const byMonth: Record<string, number> = {};
    expenses.forEach((t) => {
      const key = t.date.slice(0, 7);
      byMonth[key] = (byMonth[key] || 0) + t.amount;
    });
    const months = Object.entries(byMonth).sort((a, b) => b[0].localeCompare(a[0]));
    const currentMonth = months[0];
    const prevMonth = months[1];
    let monthChange: number | null = null;
    if (currentMonth && prevMonth) {
      monthChange = ((currentMonth[1] - prevMonth[1]) / prevMonth[1]) * 100;
    }

    // Average transaction
    const avgExpense = expenses.reduce((s, t) => s + t.amount, 0) / expenses.length;

    return { topCategory, monthChange, currentMonth, prevMonth, avgExpense };
  }, [transactions]);

  if (!insights) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="text-base font-semibold">Insights</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm">Add some transactions to see insights.</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Top Spending</span>
          </div>
          <p className="text-lg font-bold text-foreground">{insights.topCategory[0]}</p>
          <p className="text-sm text-muted-foreground">{fmt(insights.topCategory[1])} total</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${insights.monthChange !== null && insights.monthChange > 0 ? "bg-destructive/10" : "bg-success/10"}`}>
              {insights.monthChange !== null && insights.monthChange > 0 ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <TrendingUp className="h-5 w-5 text-success" />
              )}
            </div>
            <span className="text-sm font-medium text-muted-foreground">Monthly Trend</span>
          </div>
          {insights.monthChange !== null ? (
            <>
              <p className={`text-lg font-bold ${insights.monthChange > 0 ? "text-destructive" : "text-success"}`}>
                {insights.monthChange > 0 ? "+" : ""}{insights.monthChange.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">vs. previous month</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not enough data</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Avg. Expense</span>
          </div>
          <p className="text-lg font-bold text-foreground">{fmt(insights.avgExpense)}</p>
          <p className="text-sm text-muted-foreground">per transaction</p>
        </CardContent>
      </Card>
    </div>
  );
}
