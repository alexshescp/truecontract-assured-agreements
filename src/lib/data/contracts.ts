import { addDays, format } from "date-fns";

/**
 * Contract-specific type definitions used by the dashboard to present
 * high fidelity sample data. These models centralise the mock content
 * so the UI stays focused purely on presentation logic.
 */
export type ContractStatus = "draft" | "pending" | "signed" | "executed" | "at-risk" | "cancelled";

export interface ContractRecord {
  id: string;
  title: string;
  type: string;
  status: ContractStatus;
  value: number;
  currency: string;
  progress: number;
  startDate: string;
  dueDate: string;
  guarantor: string;
  riskLevel: "low" | "medium" | "high";
}

export interface ContractActivity {
  id: string;
  contractId: string;
  timestamp: string;
  summary: string;
  owner: string;
  type: "update" | "signature" | "payment" | "alert";
}

export interface ContractTask {
  id: string;
  contractId: string;
  owner: string;
  title: string;
  dueDate: string;
  status: "open" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

export interface RevenueTrendPoint {
  label: string;
  bookedValue: number;
  realizedValue: number;
}

/**
 * Pre-computed mock data that showcases the richer dashboard experience.
 * Dates are generated relative to "today" to keep the UI feeling current.
 */
const today = new Date();

const addBusinessDays = (days: number) => format(addDays(today, days), "yyyy-MM-dd");

export const CONTRACTS: ContractRecord[] = [
  {
    id: "1",
    title: "Downtown Office Lease",
    type: "Property Rental",
    status: "pending",
    value: 12000,
    currency: "USD",
    progress: 68,
    startDate: addBusinessDays(-20),
    dueDate: addBusinessDays(15),
    guarantor: "CityBank",
    riskLevel: "medium",
  },
  {
    id: "2",
    title: "Fleet Vehicle Contract",
    type: "Vehicle Rental",
    status: "signed",
    value: 8500,
    currency: "USD",
    progress: 82,
    startDate: addBusinessDays(-45),
    dueDate: addBusinessDays(5),
    guarantor: "AutoFinance Corp",
    riskLevel: "low",
  },
  {
    id: "3",
    title: "Software Development Agreement",
    type: "Service Contract",
    status: "executed",
    value: 45000,
    currency: "USD",
    progress: 100,
    startDate: addBusinessDays(-120),
    dueDate: addBusinessDays(-15),
    guarantor: "TechGuarantee Ltd",
    riskLevel: "low",
  },
  {
    id: "4",
    title: "Marketing Campaign Contract",
    type: "Service Contract",
    status: "at-risk",
    value: 15000,
    currency: "USD",
    progress: 24,
    startDate: addBusinessDays(-12),
    dueDate: addBusinessDays(2),
    guarantor: "None",
    riskLevel: "high",
  },
  {
    id: "5",
    title: "International Freight Forwarding",
    type: "Trade Services",
    status: "pending",
    value: 72000,
    currency: "USD",
    progress: 35,
    startDate: addBusinessDays(-7),
    dueDate: addBusinessDays(21),
    guarantor: "GlobalTrade Guarantees",
    riskLevel: "medium",
  },
  {
    id: "6",
    title: "Co-working Space Agreement",
    type: "Property Rental",
    status: "draft",
    value: 5400,
    currency: "USD",
    progress: 12,
    startDate: addBusinessDays(-3),
    dueDate: addBusinessDays(45),
    guarantor: "SecureGuarantee Ltd",
    riskLevel: "medium",
  },
  {
    id: "7",
    title: "Renewable Energy Equipment Lease",
    type: "Equipment Lease",
    status: "signed",
    value: 28000,
    currency: "USD",
    progress: 74,
    startDate: addBusinessDays(-65),
    dueDate: addBusinessDays(30),
    guarantor: "EcoShield Capital",
    riskLevel: "low",
  },
  {
    id: "8",
    title: "Managed IT Services Renewal",
    type: "Service Contract",
    status: "pending",
    value: 38000,
    currency: "USD",
    progress: 48,
    startDate: addBusinessDays(-28),
    dueDate: addBusinessDays(10),
    guarantor: "TrustFactor Corp",
    riskLevel: "medium",
  },
];

export const CONTRACT_ACTIVITIES: ContractActivity[] = [
  {
    id: "a-1",
    contractId: "4",
    timestamp: addBusinessDays(-1),
    summary: "Payment reminder sent to counterparty",
    owner: "Finance Team",
    type: "alert",
  },
  {
    id: "a-2",
    contractId: "2",
    timestamp: addBusinessDays(-2),
    summary: "Signature completed by City Logistics",
    owner: "Legal Team",
    type: "signature",
  },
  {
    id: "a-3",
    contractId: "1",
    timestamp: addBusinessDays(-3),
    summary: "Reviewed revised rental clause",
    owner: "Real Estate Lead",
    type: "update",
  },
  {
    id: "a-4",
    contractId: "3",
    timestamp: addBusinessDays(-4),
    summary: "Milestone payment released",
    owner: "Accounts Payable",
    type: "payment",
  },
  {
    id: "a-5",
    contractId: "5",
    timestamp: addBusinessDays(-5),
    summary: "Customs compliance documents uploaded",
    owner: "Trade Ops",
    type: "update",
  },
];

export const CONTRACT_TASKS: ContractTask[] = [
  {
    id: "t-1",
    contractId: "4",
    owner: "Finance Team",
    title: "Escalate late marketing invoice",
    dueDate: addBusinessDays(1),
    status: "in-progress",
    priority: "high",
  },
  {
    id: "t-2",
    contractId: "1",
    owner: "Legal Team",
    title: "Incorporate landlord insurance clause",
    dueDate: addBusinessDays(3),
    status: "open",
    priority: "medium",
  },
  {
    id: "t-3",
    contractId: "5",
    owner: "Compliance",
    title: "Verify trade embargo screening",
    dueDate: addBusinessDays(2),
    status: "open",
    priority: "high",
  },
  {
    id: "t-4",
    contractId: "6",
    owner: "Sales",
    title: "Confirm deposit terms with tenant",
    dueDate: addBusinessDays(7),
    status: "open",
    priority: "low",
  },
];

export const REVENUE_TREND: RevenueTrendPoint[] = [
  { label: "Apr", bookedValue: 72000, realizedValue: 64000 },
  { label: "May", bookedValue: 86000, realizedValue: 81000 },
  { label: "Jun", bookedValue: 91000, realizedValue: 87000 },
  { label: "Jul", bookedValue: 99000, realizedValue: 93000 },
  { label: "Aug", bookedValue: 102000, realizedValue: 96000 },
  { label: "Sep", bookedValue: 115000, realizedValue: 108000 },
];

/** Utility helpers */
export const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);

export const countByStatus = (records: ContractRecord[]): Record<ContractStatus, number> => {
  return records.reduce<Record<ContractStatus, number>>((accumulator, contract) => {
    accumulator[contract.status] = (accumulator[contract.status] || 0) + 1;
    return accumulator;
  }, {
    draft: 0,
    pending: 0,
    signed: 0,
    executed: 0,
    "at-risk": 0,
    cancelled: 0,
  });
};

export const totalContractValue = (records: ContractRecord[]): number =>
  records.reduce((total, contract) => total + contract.value, 0);

export const averageProgress = (records: ContractRecord[]): number => {
  if (!records.length) return 0;
  const total = records.reduce((sum, contract) => sum + contract.progress, 0);
  return Math.round(total / records.length);
};

export const riskDistribution = (records: ContractRecord[]): Record<ContractRecord["riskLevel"], number> => {
  return records.reduce<Record<ContractRecord["riskLevel"], number>>((accumulator, contract) => {
    accumulator[contract.riskLevel] = (accumulator[contract.riskLevel] || 0) + 1;
    return accumulator;
  }, { low: 0, medium: 0, high: 0 });
};
