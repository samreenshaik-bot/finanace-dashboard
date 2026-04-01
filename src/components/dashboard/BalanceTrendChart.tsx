import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BalanceTrendChart() {
  const { transactions } = useDashboard();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const byMonth: Record<string, { income: number; expense: number }> = {};
    sorted.forEach((t) => {
      const key = t.date.slice(0, 7); // YYYY-MM
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0 };
      if (t.type === "income") byMonth[key].income += t.amount;
      else byMonth[key].expense += t.amount;
    });
    let balance = 0;
    return Object.entries(byMonth).map(([month, v]) => {
      balance += v.income - v.expense;
      return { month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }), income: Math.round(v.income), expenses: Math.round(v.expense), balance: Math.round(balance) };
    });
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Balance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v}`, ""]} contentStyle={{ borderRadius: 8, border: "1px solid hsl(220,13%,91%)", fontSize: 13 }} />
              <Area type="monotone" dataKey="balance" stroke="hsl(217, 91%, 60%)" fill="url(#balGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
