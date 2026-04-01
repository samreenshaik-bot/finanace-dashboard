import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { BalanceTrendChart } from "@/components/dashboard/BalanceTrendChart";
import { SpendingBreakdownChart } from "@/components/dashboard/SpendingBreakdownChart";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";

function DashboardContent() {
  const { role } = useDashboard();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">FinTrack</h1>
            <p className="text-sm text-muted-foreground">Financial Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <RoleSwitcher />
            {role === "admin" && <AddTransactionDialog />}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceTrendChart />
          <SpendingBreakdownChart />
        </div>

        <InsightsSection />
        <TransactionsTable />
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
