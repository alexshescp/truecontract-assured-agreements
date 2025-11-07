import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, FileText } from "lucide-react";
import { CONTRACTS, CONTRACT_TASKS, formatCurrency, totalContractValue } from "@/lib/data/contracts";

const DashboardSummary = () => {
  // Aggregate a snapshot of the portfolio using the shared mock data helpers.
  const accountBalance = totalContractValue(CONTRACTS) * 0.4; // assume 40% currently held in escrow
  const activeContracts = CONTRACTS.filter((contract) => contract.status !== "cancelled").length;

  const nextPayment = CONTRACTS.filter((contract) => contract.status === "pending").sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )[0];

  const nextIncome = CONTRACT_TASKS.filter((task) => task.priority === "high").sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )[0];

  const formatDate = (isoDate: string | undefined) =>
    isoDate ? format(new Date(isoDate), "MMM d, yyyy") : "--";

  return (
    <Card className="border-b rounded-none border-x-0 border-t-0 bg-card/30 backdrop-blur-sm">
      <CardContent className="py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Escrow Balance</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {formatCurrency(Math.round(accountBalance), "USD")}
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">Active Smart Contracts</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{activeContracts}</div>
            </div>

            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-muted-foreground">Next Payment</span>
              </div>
              <div className="text-lg font-semibold text-red-600">
                {nextPayment ? formatCurrency(nextPayment.value, nextPayment.currency) : "--"}
              </div>
              <div className="text-xs text-muted-foreground">Due: {formatDate(nextPayment?.dueDate)}</div>
              <div className="text-xs text-muted-foreground truncate">
                {nextPayment ? nextPayment.title : "Awaiting new invoices"}
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-muted-foreground">Priority Action</span>
              </div>
              <div className="text-lg font-semibold text-green-600">
                {nextIncome ? nextIncome.title : "All caught up"}
              </div>
              <div className="text-xs text-muted-foreground">
                Due: {formatDate(nextIncome?.dueDate)}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Owner: {nextIncome ? nextIncome.owner : "--"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
