
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardSummary = () => {
  // Mock data - in a real app this would come from API/state management
  const accountBalance = 48750.00;
  const activeContracts = 12;
  const nextPayment = {
    amount: 12000,
    date: '2024-01-15',
    description: 'Downtown Office Lease'
  };
  const nextIncome = {
    amount: 25000,
    date: '2024-01-18',
    description: 'Software Development Payment'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="border-b rounded-none border-x-0 border-t-0 bg-card/30 backdrop-blur-sm">
      <CardContent className="py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Account Balance */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Account Balance</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {formatCurrency(accountBalance)}
              </div>
            </div>

            {/* Active Contracts */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">Active Smart Contracts</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {activeContracts}
              </div>
            </div>

            {/* Next Payment */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-muted-foreground">Next Payment</span>
              </div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(nextPayment.amount)}
              </div>
              <div className="text-xs text-muted-foreground">
                Due: {formatDate(nextPayment.date)}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {nextPayment.description}
              </div>
            </div>

            {/* Next Income */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-muted-foreground">Next Income</span>
              </div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(nextIncome.amount)}
              </div>
              <div className="text-xs text-muted-foreground">
                Expected: {formatDate(nextIncome.date)}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {nextIncome.description}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
