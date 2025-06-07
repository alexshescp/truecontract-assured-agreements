
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardProps {
  onCreateContract: () => void;
  onViewContract: (id: string) => void;
}

const Dashboard = ({ onCreateContract, onViewContract }: DashboardProps) => {
  const stats = [
    {
      title: 'Active Contracts',
      value: '12',
      change: '+2 this month',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Total Value',
      value: '$124,500',
      change: '+18% this month',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '+3% improvement',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  const contracts = [
    {
      id: '1',
      title: 'Downtown Office Lease',
      type: 'Property Rental',
      status: 'signed',
      value: '$12,000/month',
      progress: 65,
      dueDate: '2024-01-15',
      guarantor: 'CityBank'
    },
    {
      id: '2',
      title: 'Fleet Vehicle Contract',
      type: 'Vehicle Rental',
      status: 'pending',
      value: '$8,500/month',
      progress: 30,
      dueDate: '2024-01-20',
      guarantor: 'AutoFinance Corp'
    },
    {
      id: '3',
      title: 'Software Development Agreement',
      type: 'Service Contract',
      status: 'executed',
      value: '$45,000',
      progress: 100,
      dueDate: '2024-01-10',
      guarantor: 'TechGuarantee Ltd'
    },
    {
      id: '4',
      title: 'Marketing Campaign Contract',
      type: 'Service Contract',
      status: 'pending',
      value: '$15,000',
      progress: 0,
      dueDate: '2024-01-25',
      guarantor: 'None'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      signed: { label: 'Signed', variant: 'default' as const, className: 'status-signed' },
      pending: { label: 'Pending', variant: 'secondary' as const, className: 'status-pending' },
      executed: { label: 'Executed', variant: 'default' as const, className: 'status-executed' },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, className: 'status-cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const notifications = [
    {
      id: '1',
      title: 'Contract signature required',
      description: 'Downtown Office Lease needs your signature',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      id: '2',
      title: 'Payment processed',
      description: 'Fleet Vehicle Contract payment completed',
      time: '1 day ago',
      type: 'success'
    },
    {
      id: '3',
      title: 'AI Review completed',
      description: 'Marketing Campaign Contract has been analyzed',
      time: '2 days ago',
      type: 'info'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your contracts and track their progress
            </p>
          </div>
          <Button onClick={onCreateContract} className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contracts List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Contracts</CardTitle>
                <CardDescription>
                  Your latest contract activities and status updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contracts.map((contract) => (
                  <div 
                    key={contract.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onViewContract(contract.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{contract.title}</h3>
                        <p className="text-sm text-muted-foreground">{contract.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{contract.value}</p>
                        {getStatusBadge(contract.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{contract.progress}%</span>
                      </div>
                      <Progress value={contract.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                      <span>Due: {contract.dueDate}</span>
                      <span>Guarantor: {contract.guarantor}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Recent updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => {
                  const getIcon = (type: string) => {
                    switch (type) {
                      case 'warning':
                        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
                      case 'success':
                        return <CheckCircle className="h-4 w-4 text-green-500" />;
                      default:
                        return <Clock className="h-4 w-4 text-blue-500" />;
                    }
                  };

                  return (
                    <div key={notification.id} className="flex space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
