import { useMemo, useState } from "react";
import { differenceInDays, format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowLeft, Bot, CheckCircle, Clock, Eye, FileText, Send, Shield } from "lucide-react";
import {
  CONTRACTS,
  CONTRACT_ACTIVITIES,
  type ContractRecord,
  formatCurrency,
} from "@/lib/data/contracts";

interface ContractReviewProps {
  contractId: string;
  onBack: () => void;
  onSign: () => void;
}

const ContractReview = ({ contractId, onBack, onSign }: ContractReviewProps) => {
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const contract = useMemo<ContractRecord | undefined>(() => CONTRACTS.find((item) => item.id === contractId), [contractId]);

  const activities = useMemo(
    () => CONTRACT_ACTIVITIES.filter((activity) => activity.contractId === contractId),
    [contractId],
  );

  const aiSuggestions = [
    {
      type: "warning",
      category: "Legal Compliance",
      title: "Missing Force Majeure Clause",
      description: "Consider adding a force majeure clause to protect both parties in case of unforeseen circumstances.",
      suggestion:
        "Add standard force majeure language covering natural disasters, government actions, and other uncontrollable events.",
    },
    {
      type: "improvement",
      category: "Payment Terms",
      title: "Late Fee Structure",
      description: "The current late fee of $100 per day may be considered excessive in some jurisdictions.",
      suggestion:
        "Consider a percentage-based late fee (e.g., 1.5% per month) or a flat fee that complies with local regulations.",
    },
    {
      type: "success",
      category: "Security",
      title: "Security Deposit Compliance",
      description: "The security deposit amount (2x monthly rent) is within standard commercial lease practices.",
      suggestion: null,
    },
  ];

  const keyHighlights = contract
    ? [
        {
          label: "Contract Value",
          value: formatCurrency(contract.value, contract.currency),
          icon: CheckCircle,
        },
        {
          label: "Time to Due Date",
          value: `${differenceInDays(parseISO(contract.dueDate), new Date())} days remaining`,
          icon: Clock,
        },
        {
          label: "Risk Level",
          value: contract.riskLevel.toUpperCase(),
          icon: Shield,
        },
      ]
    : [];

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    // Mock AI analysis delay to illustrate asynchronous review.
    setTimeout(() => {
      setIsAiAnalyzing(false);
    }, 3000);
  };

  const getStatusBadge = (status: ContractRecord["status"]) => {
    const statusConfig = {
      draft: { label: "Draft", className: "status-draft" },
      pending: { label: "Pending Signature", className: "status-pending" },
      signed: { label: "Signed", className: "status-signed" },
      executed: { label: "Executed", className: "status-executed" },
      "at-risk": { label: "At Risk", className: "status-cancelled" },
      cancelled: { label: "Cancelled", className: "status-cancelled" },
    };

    const config = statusConfig[status] ?? statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!contract) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-10 text-center space-y-4">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">
                We couldn't locate that contract record.
              </p>
              <Button variant="outline" onClick={onBack}>
                Return to dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{contract.title}</h1>
              <p className="text-muted-foreground mt-2">
                {contract.type} • Created {format(parseISO(contract.startDate), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge(contract.status)}
              <span className="text-lg font-semibold text-primary">
                {formatCurrency(contract.value, contract.currency)} / month
              </span>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid gap-4 md:grid-cols-3">
          {keyHighlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <Card key={highlight.label}>
                <CardContent className="p-6 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{highlight.label}</p>
                    <p className="text-sm font-semibold text-foreground">{highlight.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="document" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="document">
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </TabsTrigger>
                <TabsTrigger value="ai-review">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Review
                </TabsTrigger>
                <TabsTrigger value="blockchain">
                  <Eye className="h-4 w-4 mr-2" />
                  Blockchain
                </TabsTrigger>
              </TabsList>

              <TabsContent value="document">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Summary</CardTitle>
                    <CardDescription>Review the complete contract terms and conditions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Counterparty</p>
                          <p className="font-medium text-foreground">ABC Real Estate Corp</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Guarantor</p>
                          <p className="font-medium text-foreground">{contract.guarantor}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contract Window</p>
                          <p className="font-medium text-foreground">
                            {format(parseISO(contract.startDate), "MMM d, yyyy")} – {format(parseISO(contract.dueDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <p className="font-medium text-foreground">{contract.progress}% complete</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium text-foreground">{contract.riskLevel}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Milestone</p>
                          <p className="font-medium text-foreground">Tenant improvements inspection</p>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
COMMERCIAL LEASE AGREEMENT

This Commercial Lease Agreement ("Agreement") is entered into on January 8, 2024, between ABC Real Estate Corp ("Landlord") and
TechStart Inc ("Tenant").

PREMISES: The leased premises consist of approximately 2,500 square feet of office space located at 123 Business Avenue, Downtown District.

TERM: The lease term shall commence on February 1, 2024, and continue for twelve (12) months, ending on January 31, 2025.

RENT: Tenant agrees to pay monthly rent of $12,000, due on the first day of each month. Late fees of $100 per day will apply after a 5-day grace period.

SECURITY DEPOSIT: Tenant shall provide a security deposit of $24,000 upon signing this agreement.

USE: The premises shall be used solely for general office purposes and related business activities.

UTILITIES: Tenant is responsible for electricity, internet, and phone services. Landlord provides water, heating, and building maintenance.
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-review">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>AI Legal Analysis</CardTitle>
                        <CardDescription>Automated review for legal compliance and suggestions.</CardDescription>
                      </div>
                      <Button onClick={handleAiAnalysis} disabled={isAiAnalyzing} variant="outline">
                        {isAiAnalyzing ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4 mr-2" />
                            Re-analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getSuggestionIcon(suggestion.type)}
                            <div>
                              <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
                              <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                            </div>
                          </div>
                          {suggestion.type === "warning" && (
                            <Badge variant="destructive">Action required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">{suggestion.description}</p>
                        {suggestion.suggestion && (
                          <div className="mt-3 bg-muted/40 border rounded p-3 text-xs text-muted-foreground">
                            {suggestion.suggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain">
                <Card>
                  <CardHeader>
                    <CardTitle>Signature Audit Trail</CardTitle>
                    <CardDescription>Immutable record of signatures stored on-chain.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ledger Network</span>
                      <span className="font-medium text-foreground">Polygon PoS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Smart Contract Address</span>
                      <span className="font-mono text-xs text-primary">0x9f2a...d4C3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Hash</span>
                      <span className="font-mono text-xs text-primary">0x54ab...92ff</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Verification</span>
                      <span className="font-medium text-foreground">{format(new Date(), "MMM d, yyyy HH:mm")} UTC</span>
                    </div>
                    <Separator className="my-4" />
                    <p className="text-xs text-muted-foreground">
                      All signatures captured in TrueContract are notarised using dedicated smart contracts. The blockchain record
                      includes signer identity, timestamp, cryptographic hash of the agreement PDF, and verification status from
                      third-party oracles.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Next Best Actions</CardTitle>
                <CardDescription>Prevent blockers by addressing these tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-semibold text-foreground">Schedule tenant walkthrough</p>
                  <p className="text-xs text-muted-foreground mt-1">Coordinate inspection with tenant before handover.</p>
                  <Button variant="link" className="px-0 text-xs mt-2">
                    Assign to facilities team
                  </Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-semibold text-foreground">Confirm guarantor coverage</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload the final guarantee certificate for records.</p>
                  <Button variant="link" className="px-0 text-xs mt-2">
                    Upload document
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates specific to this contract.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {activities.length === 0 && (
                  <p className="text-muted-foreground">No activity recorded yet.</p>
                )}
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium text-foreground">{activity.summary}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(parseISO(activity.timestamp), "MMM d, yyyy")}</p>
                    </div>
                    <Badge variant="outline">{activity.owner}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-foreground">Ready to finalise this agreement?</p>
              <p className="text-sm text-muted-foreground">
                Your digital signature will be notarised on-chain and shared with all parties.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack}>
                Request changes
              </Button>
              <Button onClick={onSign}>
                Sign &amp; notify
                <Send className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractReview;
