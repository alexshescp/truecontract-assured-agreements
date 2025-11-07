import { useMemo, useState } from "react";
import { differenceInDays, format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertCircle,
  ArrowRight,
  DollarSign,
  FileText,
  Filter,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CONTRACTS,
  CONTRACT_ACTIVITIES,
  CONTRACT_TASKS,
  REVENUE_TREND,
  type ContractRecord,
  type ContractStatus,
  averageProgress,
  countByStatus,
  formatCurrency,
  riskDistribution,
  totalContractValue,
} from "@/lib/data/contracts";

interface DashboardProps {
  onCreateContract: () => void;
  onViewContract: (id: string) => void;
}

type StatusFilter = ContractStatus | "all";

const STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  signed: "Signed",
  executed: "Executed",
  "at-risk": "At Risk",
  cancelled: "Cancelled",
};

const RISK_LABEL: Record<ContractRecord["riskLevel"], { label: string; tone: string }> = {
  low: { label: "Low", tone: "text-green-600" },
  medium: { label: "Medium", tone: "text-amber-600" },
  high: { label: "High", tone: "text-red-600" },
};

const Dashboard = ({ onCreateContract, onViewContract }: DashboardProps) => {
  // Dashboard level filters ensure the UI can scale as real data arrives later.
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const contractTypes = useMemo(() => {
    const uniqueTypes = new Set(CONTRACTS.map((contract) => contract.type));
    return ["all", ...Array.from(uniqueTypes)];
  }, []);

  const filteredContracts = useMemo(() => {
    return CONTRACTS.filter((contract) => {
      const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
      const matchesType = typeFilter === "all" || contract.type === typeFilter;
      const matchesSearch = searchTerm
        ? contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contract.guarantor.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [statusFilter, typeFilter, searchTerm]);

  // Pre-compute expensive values so React renders stay efficient.
  const kpiCards = useMemo(() => {
    const totalValue = totalContractValue(filteredContracts);
    const avgProgress = averageProgress(filteredContracts);
    const activeCount = filteredContracts.filter((contract) => contract.status !== "cancelled").length;

    return [
      {
        title: "Portfolio Value",
        value: formatCurrency(totalValue, filteredContracts[0]?.currency ?? "USD"),
        helper: "Total contract value in the current view",
        icon: DollarSign,
      },
      {
        title: "Active Contracts",
        value: activeCount.toString(),
        helper: "Contracts that are progressing towards execution",
        icon: FileText,
      },
      {
        title: "Average Progress",
        value: `${avgProgress}%`,
        helper: "Overall completion across filtered contracts",
        icon: TrendingUp,
      },
    ];
  }, [filteredContracts]);

  const statusSummary = useMemo(() => countByStatus(CONTRACTS), []);
  const riskSplit = useMemo(() => riskDistribution(CONTRACTS), []);

  const upcomingRenewals = useMemo(() => {
    return [...CONTRACTS]
      .filter((contract) => contract.status !== "cancelled")
      .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
      .slice(0, 4);
  }, []);

  const tasks = useMemo(() => CONTRACT_TASKS, []);

  const activities = useMemo(() => CONTRACT_ACTIVITIES.slice(0, 5), []);

  const getStatusBadgeVariant = (status: ContractStatus) => {
    switch (status) {
      case "draft":
        return "outline" as const;
      case "pending":
        return "secondary" as const;
      case "signed":
        return "default" as const;
      case "executed":
        return "default" as const;
      case "at-risk":
        return "destructive" as const;
      case "cancelled":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const formatDate = (isoDate: string) => format(parseISO(isoDate), "MMM d, yyyy");

  const handleResetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ------------------------------------------------------------------ */}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contract Intelligence Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor performance, mitigate risk, and keep your commercial agreements on track.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="w-full md:w-auto" onClick={handleResetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            <Button onClick={onCreateContract} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Search
                </label>
                <Input
                  placeholder="Search contracts or guarantors..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contract Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------------ */}
        {/* KPI cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{card.helper}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ---------------------------------------------------------------- */}
          {/* Contract list */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>Insights tailored to the filters you have selected above.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onViewContract(contract.id)}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{contract.title}</h3>
                      <p className="text-sm text-muted-foreground">{contract.type}</p>
                    </div>
                    <div className="flex items-center gap-3 md:text-right">
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {formatCurrency(contract.value, contract.currency)}
                        </p>
                        <Badge variant={getStatusBadgeVariant(contract.status)}>{STATUS_LABELS[contract.status]}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className={`font-semibold ${RISK_LABEL[contract.riskLevel].tone}`}>
                          {RISK_LABEL[contract.riskLevel].label} risk
                        </p>
                        <p>Guarantor: {contract.guarantor}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 mt-4">
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{contract.progress}%</span>
                      </div>
                      <Progress value={contract.progress} className="h-2" />
                    </div>
                    <div className="flex flex-col text-xs text-muted-foreground gap-1">
                      <span>Start: {formatDate(contract.startDate)}</span>
                      <span>Due: {formatDate(contract.dueDate)}</span>
                      <span>
                        {differenceInDays(parseISO(contract.dueDate), new Date()) >= 0
                          ? `${differenceInDays(parseISO(contract.dueDate), new Date())} days remaining`
                          : "Past due"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredContracts.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-60" />
                  <p>No contracts match the selected filters. Adjust the filters to see more records.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Health summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lifecycle Overview</CardTitle>
                <CardDescription>Distribution of contracts across each lifecycle stage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(statusSummary).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(status as ContractStatus)}>
                        {STATUS_LABELS[status as ContractStatus]}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-foreground">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Radar</CardTitle>
                <CardDescription>Focus remediation where exposure is highest.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(riskSplit).map(([level, count]) => {
                  const total = CONTRACTS.length || 1;
                  const percentage = Math.round((count / total) * 100);
                  return (
                    <div key={level}>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className={`font-semibold ${RISK_LABEL[level as keyof typeof RISK_LABEL].tone}`}>
                          {RISK_LABEL[level as keyof typeof RISK_LABEL].label}
                        </span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2 mt-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ---------------------------------------------------------------- */}
          {/* Revenue trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Momentum</CardTitle>
              <CardDescription>Booked versus realised value for the last six months.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="label" className="text-xs text-muted-foreground" />
                  <YAxis className="text-xs text-muted-foreground" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--card))", borderRadius: 8 }}
                    formatter={(value: number) => formatCurrency(value, "USD")}
                  />
                  <Area type="monotone" dataKey="bookedValue" stroke="#2563eb" fill="#2563eb20" name="Booked" />
                  <Area type="monotone" dataKey="realizedValue" stroke="#16a34a" fill="#16a34a20" name="Realised" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Upcoming renewals */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Renewals</CardTitle>
              <CardDescription>Proactively engage clients before contracts expire.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingRenewals.map((contract) => (
                <div key={contract.id} className="p-3 border rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{contract.title}</p>
                    <Badge variant={getStatusBadgeVariant(contract.status)}>{STATUS_LABELS[contract.status]}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Due {formatDate(contract.dueDate)}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{differenceInDays(parseISO(contract.dueDate), new Date())} days remaining</span>
                    <span className="font-medium text-foreground">{contract.guarantor}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ---------------------------------------------------------------- */}
          {/* Activity feed */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Coordinated actions keep contracts moving forward.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity) => {
                const iconMap = {
                  alert: <AlertCircle className="h-4 w-4 text-red-500" />,
                  signature: <ShieldCheck className="h-4 w-4 text-green-500" />,
                  payment: <DollarSign className="h-4 w-4 text-blue-500" />,
                  update: <Users className="h-4 w-4 text-purple-500" />,
                };
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {iconMap[activity.type]}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.summary}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(activity.timestamp)} • {activity.owner}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onViewContract(activity.contractId)}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Task list */}
          <Card>
            <CardHeader>
              <CardTitle>Team Workboard</CardTitle>
              <CardDescription>Resolve outstanding items before they become blockers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => {
                const isOverdue = differenceInDays(parseISO(task.dueDate), new Date()) < 0;
                const priorityTone =
                  task.priority === "high"
                    ? "text-red-600"
                    : task.priority === "medium"
                      ? "text-amber-600"
                      : "text-muted-foreground";

                return (
                  <div key={task.id} className="border rounded-lg p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{task.title}</p>
                      <Badge variant={task.status === "completed" ? "outline" : "secondary"}>{task.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Owner: {task.owner}</p>
                    <p className={`text-xs font-medium ${priorityTone}`}>
                      Priority: {task.priority.toUpperCase()}
                    </p>
                    <p className={`text-xs ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                      Due {formatDate(task.dueDate)}
                    </p>
                    <Button variant="link" className="px-0 text-sm" onClick={() => onViewContract(task.contractId)}>
                      Review contract
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
